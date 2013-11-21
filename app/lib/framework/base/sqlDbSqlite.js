// Sqlite SQL database methods (CommonJS)
// compatible with kernelSqlDb conventions

var DB = Ti.Database;
var logPrefix ='SqlDbSqlite: ';
var dbName = '';

var debug = false;	// local debug support

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

methods.db = {
	name: '',
	handle: null,
};

methods.db.open = function(args) {
	this.db.name = args.name;
	if (debug) log.debug(logPrefix + 'db.open(' + db.name + ')');
	return this.db.handle = DB.open(db.name);
};

methods.db.execute = function(args) {
	var sql = args.sql,
		vararg = args.vararg;
	
	if (debug) log.debug(logPrefix + 'db.execute(' + sql + ', ' + vararg + ')');
	return {rs: this.db.handle.execute(sql, vararg)};
};

methods.db.close = function() {
	if (debug) log.debug(logPrefix + 'db.close()');
	this.db.handle.close();
};

methods.db.remove = function() {
	if (debug) log.debug(logPrefix + 'db.remove()');
	this.db.handle.remove();
};

methods.db.getFile = function() {
	if (debug) log.debug(logPrefix + 'db.getFile()');
	return this.db.handle.getFile();
};


methods.db.getLastInsertRowId = function() {
	if (debug) log.debug(logPrefix + 'db.getLastInsertRowId()');
	return this.db.handle.getLastInsertRowId();
};

methods.db.getName = function() {
	if (debug) log.debug(logPrefix + 'db.getName()');
	return this.db.handle.getName();
};

methods.db.setName = function(args) {
	var dbName = args.name
	if (debug) log.debug(logPrefix + 'db.setName(' + dbName + ')');
	this.db.handle.setName(dbName);
};

methods.db.getRowsAffected = function() {
	if (debug) log.debug(logPrefix + 'db.getRowsAffected()');
	return this.db.handle.getRowsAffected();
};

methods.db.setRowsAffected = function(args) {
	var numRows = args.numRows;
	
	if (debug) log.debug(logPrefix + 'db.setRowsAffected(' + numRows + ')');
	this.db.handle.setRowsAffected();
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
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.isValidRow()');
	return recset.isValidRow();
};

methods.rs.getFieldCount = function(args) {
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.getFieldCount()');
	return recset.getFieldCount();
};

methods.rs.getFieldName = function(args) {
	var recset = args.rs,
		fieldIndex = args.index;
	
	if (debug) log.debug(logPrefix + 'rs.getFieldName(' + fieldIndex + ')');
	return recset.getFieldName(fieldIndex);
};

methods.rs.getRowCount = function(args) {
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.getRowCount()');
	return recset.getRowCount();
};

methods.rs.getField = function(args) {
	var recset = args.rs,
		fieldIndex = args.index,
		type = args.type;
	
	if (debug) log.debug(logPrefix + 'rs.getField(' + fieldIndex + ')');
	return recset.getField(fieldIndex, type);
};

methods.rs.getFieldByName = function(args) {
	var recset = args.rs,
		fieldName = args.fieldName,
		type = args.type;
	
	if (debug) log.debug(logPrefix + 'rs.getFieldByName(' + fieldName + ')');
	return recset.getFieldByName(fieldName, type);
};

methods.rs.next = function(args) {
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.next()');
	return recset.next();
};

methods.rs.close = function(args) {
	var recset = args.rs;
	
	if (debug) log.debug(logPrefix + 'rs.close()');
	recset.close();
};

exports.methods = methods;
