// SQL database kernel extension (CommonJS)

var Alloy = require('Alloy');
var log = require('sc-framework/kernel/core/kernelLogging').log;
var logPrefix ='SqlDb: ';

var sqldb = {
	// defaults
	config: {
		debug: false
	}
};

// set up defaults ----------------------
sqldb.methods = {
	setDebug: function(debug, args) { log.error(logPrefix + 'setDebug: unimplemented'); },
	setLog: function(debug, args) { log.error(logPrefix + 'setLog: unimplemented'); },
	db: {
		open: function(debug, args) { log.error(logPrefix + 'db.open: unimplemented'); },
		execute: function(debug, args) { log.error(logPrefix + 'db.execute: unimplemented'); },
		close: function(debug, args) { log.error(logPrefix + 'db.close: unimplemented'); },
		remove: function(debug, args) { log.error(logPrefix + 'db.remove: unimplemented'); },
		getFile: function(debug, args) { log.error(logPrefix + 'db.getFile: unimplemented'); },
		getLastInsertRowId: function(debug, args) { log.error(logPrefix + 'db.getLastInsertRowId: unimplemented'); },
		getName: function(debug, args) { log.error(logPrefix + 'db.getName: unimplemented'); },
		setName: function(debug, args) { log.error(logPrefix + 'db.setName: unimplemented'); },
		getRowsAffected: function(debug, args) { log.error(logPrefix + 'db.getRowsAffected: unimplemented'); },
		setRowsAffected: function(debug, args) { log.error(logPrefix + 'db.setRowsAffected: unimplemented'); }
	},
	rs: {
		type: {},
		isValidRow: function(debug, args) { log.error(logPrefix + 'rs.isValidRow: unimplemented'); },
		getFieldCount: function(debug, args) { log.error(logPrefix + 'rs.getFieldCount: unimplemented'); },
		getFieldName: function(debug, args) { log.error(logPrefix + 'rs.getFieldName: unimplemented'); },
		getRowCount: function(debug, args) { log.error(logPrefix + 'rs.getRowCount: unimplemented'); },
		getField: function(debug, args) { log.error(logPrefix + 'rs.getField: unimplemented'); },
		getFieldByName: function(debug, args) { log.error(logPrefix + 'rs.getFieldByName: unimplemented'); },
		next: function(debug, args) { log.error(logPrefix + 'rs.next: unimplemented'); },
		close: function(debug, args) { log.error(logPrefix + 'rs.close: unimplemented'); }
	}
};

// --------------------------------------

sqldb.setConfig = function(config) {
	var _ = require('Alloy/underscore')._;
	_.extend(sqldb.config, config);
	
	if (sqldb.config.debug) log.debug(logPrefix + 'debugging enabled');

	switch (sqldb.config.type) {
	case 'local':
		sqldb.methods = require('sc-framework/base/core/sqlDbSqlite').methods;		
		sqldb.methods.setDebug(sqldb.config.debug);
		sqldb.methods.setLog(log);
		break;
	default:
		log.error(logPrefix + 'setConfig, invalid type: ' + sqldb.type);
		break;
	}
}

sqldb.dbOpen = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbOpen, args: ' + JSON.stringify(args));
	sqldb.methods.db.open(args);
};

sqldb.dbExecute = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbExecute, args: ' + JSON.stringify(args));
	sqldb.methods.db.execute(args);
};


sqldb.dbClose = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbClose, args: ' + JSON.stringify(args));
	sqldb.methods.db.close(args);
};


sqldb.dbRemove = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbRemove, args: ' + JSON.stringify(args));
	sqldb.methods.db.remove(args);
};

sqldb.dbGetFile = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbGetFile, args: ' + JSON.stringify(args));
	sqldb.methods.db.getFile(args);
};

sqldb.dbGetLastInsertRowId = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbGetLastInsertRowId, args: ' + JSON.stringify(args));
	sqldb.methods.db.getLastInsertRowId(args);
};

sqldb.dbGetName = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbGetName, args: ' + JSON.stringify(args));
	sqldb.methods.db.getName(args);
};

sqldb.dbSetName = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbSetName, args: ' + JSON.stringify(args));
	sqldb.methods.db.setName(args);
};

sqldb.dbGetRowsAffected = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbGetRowsAffected, args: ' + JSON.stringify(args));
	sqldb.methods.db.getRowsAffected(args);
};

sqldb.dbSetRowsAffected = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'dbSetRowsAffected, args: ' + JSON.stringify(args));
	sqldb.methods.db.setRowsAffected(args);
};

sqldb.rsType = sqldb.methods.rs.type;

sqldb.rsIsValidRow = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsIsValidRow, args: ' + JSON.stringify(args));
	sqldb.methods.rs.isValidRow(args);
};

sqldb.rsGetFieldCount = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsGetFieldCount, args: ' + JSON.stringify(args));
	sqldb.methods.rs.getFieldCount(args);
};

sqldb.rsGetFieldName = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsGetFieldName, args: ' + JSON.stringify(args));
	sqldb.methods.rs.getFieldName(args);
};

sqldb.rsGetRowCount = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsGetRowCount, args: ' + JSON.stringify(args));
	sqldb.methods.rs.getRowCount(args);
};

sqldb.rsGetField = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsGetField, args: ' + JSON.stringify(args));
	sqldb.methods.getField.setRowsAffected(args);
};

sqldb.rsGetFieldByName = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsGetFieldByName, args: ' + JSON.stringify(args));
	sqldb.methods.rs.getFieldByName(args);
};

sqldb.rsNext = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsNext, args: ' + JSON.stringify(args));
	sqldb.methods.rs.next(args);
};

sqldb.rsClose = function(args) {
	if (sqldb.config.debug) log.debug(logPrefix + 'rsClose, args: ' + JSON.stringify(args));
	sqldb.methods.rs.close(args);
};

exports.sqldb = sqldb;
