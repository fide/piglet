// SQLite database methods (CommonJS)
// compatible with kernelSqlDb conventions

var DB = Ti.Database;
var logPrefix ='SqlDbSqlite: ';

var debug = false;	// local debug support

function needCB() {
	log.error(logPrefix + needCB.caller + ' no callback provided')
}

function optionalCB() {};

var log = {
		info: function(arg) { Ti.API.info(arg);},
		debug: function(arg) { Ti.API.debug(arg);},
		error: function(arg) { Ti.API.error(arg);},
};

var methods = {};

methods.setDebug = function(flag) {
	debug = flag;
}

methods.setLog = function(_log) {
	log = _log;
};

methods.db = {};

methods.db.open = function(args) {
	var name = args.name;
	var cb = args.callback || needCB;
	
	if (debug) log.debug(logPrefix + 'db.open(' + name + ')');
	cb(null, {db:DB.open(name)});
};

methods.db.execute = function(args) {
	var db = args.db;
	var cb = args.callback || needCB;
	var sql = args.sql;
	var vararg = args.vararg;
	
	if (vararg) {
		if (debug) log.debug(logPrefix + "db.execute(" + "'" + sql + "'" + ", " + vararg + ")");
		cb({rs: db.execute(sql, vararg)});
	} else {
		if (debug) log.debug(logPrefix + "db.execute(" + "'" + sql + "')");
		cb(null, {rs: db.execute(sql)});
	}
};

methods.db.close = function(args) {
	var db = args.db;
	var cb = args.callback || optionalCB;
	
	if (debug) log.debug(logPrefix + 'db.close()');
	db.close();
	cb(null, {code:true});
};

methods.db.remove = function(args) {
	var db = args.db;
	var cb = args.callback || optionalCB;
	
	if (debug) log.debug(logPrefix + 'db.remove()');
	db.remove();
	cb(null, {code:true});
};

methods.db.getFile = function(args) {
	var db = args.db;
	var cb = args.callback || needCB;
	
	if (debug) log.debug(logPrefix + 'db.getFile()');
	cb(null: {file: db.getFile()});
};

methods.db.getLastInsertRowId = function(args) {
	var db = args.db;
	var cb = args.callback || needCB;
	
	if (debug) log.debug(logPrefix + 'db.getLastInsertRowId()');
	cb(null, {id: db.getLastInsertRowId()});
};

methods.db.getName = function(args) {
	var db = args.db;
	var cb = args.callback || needCB;
	
	if (debug) log.debug(logPrefix + 'db.getName()');
	cb(null, {name: db.getName()});
};

methods.db.setName = function(args) {
	var db = args.db;
	var cb = args.callback || optionalCB;
	var dbName = args.name;
	
	if (debug) log.debug(logPrefix + 'db.setName(' + dbName + ')');
	db.setName(dbName);
	cb(null, {code:true});
};

methods.db.getRowsAffected = function(args) {
	var db = args.db;
	var cb = args.callback || needCB;
	
	if (debug) log.debug(logPrefix + 'db.getRowsAffected()');
	cb(null, {rows: db.getRowsAffected()});
};

methods.db.setRowsAffected = function(args) {
	var db = args.db;
	var cb = args.callback || optionalCB;
	var numRows = args.numRows;
	
	if (debug) log.debug(logPrefix + 'db.setRowsAffected(' + numRows + ')');
	db.setRowsAffected();
	cb(null, {code:true});
};

methods.rs = {
	type: {
		DOUBLE: Ti.Database.FIELD_TYPE_DOUBLE,
		FLOAT: Ti.Database.FIELD_TYPE_FLOAT,
		INT: Ti.Database.FIELD_TYPE_INT,
		STRING: Ti.Database.FIELD_TYPE_STRING
	}
};

methods.rs.isValidRow = function(args) {
	var cb = args.callback || needCB;
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.isValidRow()');
	cb(null, {code: recset.isValidRow()});
};

methods.rs.getFieldCount = function(args) {
	var cb = args.callback || needCB;
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.getFieldCount()');
	cb(null, {count: recset.getFieldCount()});
};

methods.rs.getFieldName = function(args) {
	var cb = args.callback || needCB;
	var recset = args.rs,
		fieldIndex = args.index;
	
	if (debug) log.debug(logPrefix + 'rs.getFieldName(' + fieldIndex + ')');
	cb(null, {name: recset.getFieldName(fieldIndex)});
};

methods.rs.getRowCount = function(args) {
	var cb = args.callback || needCB;
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.getRowCount()');
	cb(null, {count: recset.getRowCount()});
};

methods.rs.getField = function(args) {
	var cb = args.callback || needCB;
	var recset = args.rs,
		fieldIndex = args.index,
		type = args.type;
	
	if (debug) log.debug(logPrefix + 'rs.getField(' + fieldIndex + ')');
	cb(null, {index: recset.getField(fieldIndex, type)});
};

methods.rs.getFieldByName = function(args) {
	var cb = args.callback || needCB;
	var recset = args.rs,
		name = args.name,
		type = args.type;
	
	if (debug) log.debug(logPrefix + 'rs.getFieldByName(' + name + ')');
	cb(null, {field: recset.getFieldByName(name, type)});
};

methods.rs.next = function(args) {
	var cb = args.callback || needCB;
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.next()');
	cb(null, {code: recset.next()});
};

methods.rs.close = function(args) {
	var cb = args.callback || optionalCB;
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.close()');
	recset.close();
	cb(null, {code:true});
};

exports.methods = methods;
