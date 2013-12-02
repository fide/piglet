// Titanium property methods (CommonJS)
// compatible with kernelKeyObject I/O conventions

var TAP = Ti.App.Properties;
var logPrefix ='TiProperties: ';

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

methods.getKeys = function(args) {
	var cb = args.callback || needCB;
	
	if (debug) log.debug(logPrefix + 'getKeys');
	cb(TAP.listProperties());
}

methods.getObject = function(args) {
	var cb = args.callback || needCB;
	var key = args.key;
	
	var object = TAP.getObject(key);
	if (debug) log.debug(logPrefix + 'getObject('+key+')' + JSON.stringify(object));
	cb(object);
}

methods.setObject = function(args) {
	var cb = args.callback || optionalCB;
	var key = args.key;
	var object = args.object;
	
	if (debug) log.debug(logPrefix + 'setObject('+key+') = ' + JSON.stringify(object));
	TAP.setObject(key, object);
	cb(true);
}

methods.removeObject = function(args) {
	var cb = args.callback || optionalCB;
	var key = args.key;

	if (debug) log.debug(logPrefix + 'removeObject('+key+')');
	TAP.removeProperty(key);
	cb(true);
}

exports.methods = methods;
