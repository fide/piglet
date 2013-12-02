var _ = require('alloy/underscore')._;
var sqldb = require('sc-framework/kernel/core/kernelSqlDb').sqldb;

// The database name used when none is specified in the
// model configuration.
var ALLOY_DB_DEFAULT = '_alloy_';
var ALLOY_ID_DEFAULT = 'alloy_id';

function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
	return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}

var cache = {
	config: {},
	Model: {}
};

function Sync(method, model, opts) {
	var table =  model.config.adapter.collection_name,
		columns = model.config.columns,
		dbName = model.config.adapter.db_name || ALLOY_DB_DEFAULT,
		resp = null,
		db, sql;

	switch (method) {
		case 'create':
		case 'update':
			resp = (function() {
				var attrObj = {};

				if (!model.id) {
					model.id = model.idAttribute === ALLOY_ID_DEFAULT ? guid() : null;
					attrObj[model.idAttribute] = model.id;
					model.set(attrObj, { silent: true });
				}

				// assemble columns and values
				var names = [], values = [], q = [];
				for (var k in columns) {
					names.push(k);
					values.push(model.get(k));
					q.push("?");
				}

//				db = Ti.Database.open(dbName);
				sqldb.dbOpen({
					name: dbName,
					callback: function(err, result) {
						if (err) throw err;
						db = result.db;
						
//						db.execute('BEGIN;');
						sqldb.dbExecute({
							db: db,
							sql: 'BEGIN;',
							vararg: null,
							callback: function(err, result) {
								if (err) throw err;
								
//								db.execute(sql, values);
								var sql = "REPLACE INTO " + table + " (" + names.join(",") + ") VALUES (" + q.join(",") + ");";
								sqldb.dbExecute({
									db: db,
									sql: values,
									callback: function(err, result) {
										if (err) throw err;
									}
								});
							}
						});
					}
				})
				
				// if model.id is still null, grab the last inserted id
				if (model.id === null) {
					var sqlId = "SELECT last_insert_rowid();";
					var rs = db.execute(sqlId);
					if (rs && rs.isValidRow()) {
						model.id = rs.field(0);
						attrObj[model.idAttribute] = model.id;
						model.set(attrObj, { silent: true });
					} else {
						Ti.API.warn('Unable to get ID from database for model: ' + model.toJSON());
					}
					if (rs) { rs.close(); }
				}

				// cleanup
				db.execute('COMMIT;');
				db.close();

				return model.toJSON();
			})();
			break;

		case 'read':
			// print warning about using both id and query
			if (opts.query && opts.id) {
				Ti.API.warn('Both "query" and "id" options were specified for model.fetch(). "id" will be ignored.');
			}

			// determine the query to execute
			sql = 'SELECT * FROM ' + table;
			if (opts.query) {
				sql = opts.query;
			} else if (opts.id) {
				sql += ' WHERE ' + model.idAttribute + ' = ' + opts.id;
			}

			// execute the select query
			db = Ti.Database.open(dbName);
			var rs;

			// is it a string or a prepared statement?
			if (_.isString(sql)) {
				rs = db.execute(sql);
			} else {
				rs = db.execute(sql.statement, sql.params);
			}

			var len = 0;
			var values = [];

			// iterate through all queried rows
			while(rs.isValidRow())
			{
				var o = {};
        var fc = 0;

                // TODO: https://jira.appcelerator.org/browse/ALOY-459
				fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;

				// create list of rows returned from query
				_.times(fc,function(c){
					var fn = rs.fieldName(c);
					o[fn] = rs.fieldByName(fn);
				});
				values.push(o);

				len++;
				rs.next();
			}

			// close off db after read query
			rs.close();
			db.close();

			// shape response based on whether it's a model or collection
			model.length = len;
			if (len === 1) {
				resp = values[0];
			} else {
				resp = values;
			}
			break;

		case 'delete':
			sql = 'DELETE FROM '+table+' WHERE ' + model.idAttribute + '=?';

			// execute the delete
			db = Ti.Database.open(dbName);
			db.execute(sql, model.id);
			db.close();

			model.id = null;
			resp = model.toJSON();
			break;
	}

  // process success/error handlers, if present
	if (resp) {
		if (_.isFunction(opts.success)) { opts.success(resp); }
		if (method === "read" && !opts.silent) { model.trigger("fetch", { fromAdapter: true }); }
  } else {
		if (_.isFunction(opts.error)) { opts.error(resp); }
  }

}

function installDatabase(config) {
	// get the database name from the db file path
	var dbFile = config.adapter.db_file;
	var table = config.adapter.collection_name;

	var rx = /(^|.*\/)([^\/]+)\.[^\/]+$/;
	var match = dbFile.match(rx);
	if (match === null) {
		throw 'Invalid sql database filename "' + dbFile + '"';
	}
	//var isAbsolute = match[1] ? true : false;
	config.adapter.db_name = config.adapter.db_name || match[2];
	var dbName = config.adapter.db_name;

	// install and open the preloaded db
	Ti.API.debug('Installing sql database "' + dbFile + '" with name "' + dbName + '"');
	var db = Ti.Database.install(dbFile, dbName);

	// set remoteBackup status for iOS
	if (config.adapter.remoteBackup === false && OS_IOS) {
		Ti.API.debug('iCloud "do not backup" flag set for database "'+ dbFile + '"');
		db.file.setRemoteBackup(false);
	}

	// compose config.columns from table definition in database
	var rs = db.execute('pragma table_info("' + table + '");');
	var columns = {};
	while (rs.isValidRow()) {
		var cName = rs.fieldByName('name');
		var cType = rs.fieldByName('type');
		columns[cName] = cType;

		// see if it already has the ALLOY_ID_DEFAULT
		if (cName === ALLOY_ID_DEFAULT && !config.adapter.idAttribute) {
			config.adapter.idAttribute = ALLOY_ID_DEFAULT;
		}

		rs.next();
	}
	config.columns = columns;
	rs.close();

	// make sure we have a unique id field
	if (config.adapter.idAttribute) {
		if (!_.contains(_.keys(config.columns), config.adapter.idAttribute)) {
			throw 'config.adapter.idAttribute "' + config.adapter.idAttribute + '" not found in list of columns for table "' + table + '"\n' +
				'columns: [' + _.keys(config.columns).join(',') + ']';
		}
	} else {
		Ti.API.info('No config.adapter.idAttribute specified for table "' + table + '"');
		Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');

		var fullStrings = [],
			colStrings = [];
		_.each(config.columns, function(type, name) {
			colStrings.push(name);
			fullStrings.push(name + ' ' + type);
		});
		var colsString = colStrings.join(',');
		db.execute('ALTER TABLE ' + table + ' RENAME TO ' + table + '_temp;');
		db.execute('CREATE TABLE ' + table + '(' + fullStrings.join(',') + ',' + ALLOY_ID_DEFAULT + ' TEXT UNIQUE);');
		db.execute('INSERT INTO ' + table + '(' + colsString + ',' + ALLOY_ID_DEFAULT + ') SELECT ' + colsString + ',CAST(_ROWID_ AS TEXT) FROM ' + table + '_temp;');
		db.execute('DROP TABLE ' + table + '_temp;');
		config.columns[ALLOY_ID_DEFAULT] = 'TEXT UNIQUE';
		config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	}

	// close the db handle
	db.close();
}

module.exports.beforeModelCreate = function(config, name) {
	// use cached config if it exists
	if (cache.config[name]) {
		return cache.config[name];
	}

	// check platform compatibility
	if (Ti.Platform.osname === 'mobileweb' || typeof Ti.Database === 'undefined') {
		throw 'No support for Titanium.Database in MobileWeb environment.';
	}

	// install database file, if specified
	if (config.adapter.db_file) { installDatabase(config); }
	if (!config.adapter.idAttribute) {
		Ti.API.info('No config.adapter.idAttribute specified for table "' + config.adapter.collection_name + '"');
		Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');
		config.columns[ALLOY_ID_DEFAULT] = 'TEXT UNIQUE';
		config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	}

	// add this config to the cache
	cache.config[name] = config;

	return config;
};

module.exports.afterModelCreate = function(Model, name) {
	// use cached Model class if it exists
	if (cache.Model[name]) {
		return cache.Model[name];
	}

	// create the Model class
	Model = Model || {};
	Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;

	// Add the Model class to the cache
	cache.Model[name] = Model;

	return Model;
};

module.exports.sync = Sync;
