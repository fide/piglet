// Key/Object kernel extension (CommonJS)

var Alloy = require('Alloy');
var log = require('sc-framework/kernel/core/kernelLogging').log;
var logPrefix ='KeyObject: ';

var keyobject = {
	// defaults
	config: {
		debug: false
	}
};

// set up defaults ----------------------
keyobject.methods = {
	setDebug: function(debug, args) { log.error(logPrefix + 'setDebug: unimplemented'); },
	setLog: function(debug, args) { log.error(logPrefix + 'setLog: unimplemented'); },
	getKeys: function(debug, args) { log.error(logPrefix + 'getKeys: unimplemented'); },
	getObject: function(debug, args) { log.error(logPrefix + 'getObject: unimplemented'); },
	setObject: function(debug, args) { log.error(logPrefix + 'setObject: unimplemented'); },
	removeObject: function(debug, args) { log.error(logPrefix + 'removeObject: unimplemented'); }
};
// --------------------------------------
	
keyobject.setConfig = function(config) {
	var _ = require('Alloy/underscore')._;
	_.extend(keyobject.config, config);
	
	if (keyobject.config.debug) log.debug(logPrefix + 'debugging enabled');

	switch (keyobject.config.type) {
	case 'local':
		keyobject.methods = require('sc-framework/base/core/keyObjectProperties').methods;
		keyobject.methods.setDebug(keyobject.config.debug);
		keyobject.methods.setLog(log);
		break;
	default:
		log.error(logPrefix + 'setConfig, invalid type: ' + keyobject.type);
		break;
	}
}

keyobject.getKeys = function(args) {
	if (keyobject.config.debug) log.debug(logPrefix + 'getKeys, args: ' + JSON.stringify(args));
	keyobject.methods.getKeys(args);
};


keyobject.getObject = function(args) {
	if (keyobject.config.debug) log.debug(logPrefix + 'getObject, args: ' + JSON.stringify(args));
	keyobject.methods.getObject(args);
};

keyobject.setObject = function(args) {
	if (keyobject.config.debug) log.debug(logPrefix + 'setObject, args: ' + JSON.stringify(args));
	keyobject.methods.setObject(args);
};

keyobject.removeObject = function(args) {
	if (keyobject.config.debug) log.debug(logPrefix + 'removeObject args: ' + JSON.stringify(args));	
	keyobject.methods.removeObject(args);
};

exports.keyobject = keyobject;
