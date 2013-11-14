// Titanium property methods (CommonJS)
// compatible with kernelKeyObject I/O conventions

var TAP = Ti.App.Properties;
var logPrefix ='TiProperties: ';

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

methods.getKeys = function(args) {
	if (debug) log.debug(logPrefix + 'getKeys');
	return TAP.listProperties()
}

methods.getObject = function(args) {
	var key = args.key,
		object = TAP.getObject(key);
	
	if (debug) log.debug(logPrefix + 'getObject('+key+') = ' + JSON.stringify(object));
	return object;
}

methods.setObject = function(args) {
	var key = args.key,
		object = args.object;
	
	if (debug) log.debug(logPrefix + 'setObject('+key+') = ' + JSON.stringify(object));
	TAP.setObject(key, object);
}

methods.removeObject = function(args) {
	var key = args.key;

	if (debug) log.debug(logPrefix + 'removeObject('+key+')');
	TAP.removeProperty(key);
}

exports.methods = methods;
