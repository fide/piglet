// BaaS kernel extension (CommonJS)

var Alloy = require('Alloy');
var log = require('framework/kernel/kernelLogging').log;
var logPrefix ='BaaS: ';

var baas = {
	// defaults
	config: {
		debug: false
	}
};

// set up defaults ----------------------
baas.methods = {
	setDebug: function(debug, args) { log.error(logPrefix + 'setDebug: unimplemented'); },
	setLog: function(debug, args) { log.error(logPrefix + 'setLog: unimplemented'); },
	userLogin: function(debug, args) { log.error(logPrefix + 'userLogin: unimplemented'); },
	userLogout: function(debug, args) { log.error(logPrefix + 'userLogout: unimplemented'); },
	userLoggedIn: function(debug, args) { log.error(logPrefix + 'userLoggedIn: unimplemented'); },
	userCreate: function(debug, args) { log.error(logPrefix + 'userCreate: unimplemented'); },
	sessionRestore: function(debug, args) { log.error(logPrefix + 'sessionRestore: unimplemented'); }
};
// --------------------------------------
	
baas.setConfig = function(config) {
	var _ = require('Alloy/underscore')._;
	_.extend(baas.config, config);
	
	if (baas.config.debug) log.debug(logPrefix + 'debugging enabled');

	switch (baas.config.type) {
	case 'acs':
		baas.methods = require('framework/base/core/baasACS').methods;
		baas.methods.setDebug(baas.config.debug);
		baas.methods.setLog(log);
		break;
	default:
		log.error(logPrefix + 'setConfig, invalid type: ' + baas.type);
		break;
	}
}

baas.userLogin = function(args) {
	if (baas.config.debug) log.debug(logPrefix + 'userLogin, args: ' + JSON.stringify(args));
	baas.methods.userLogin(args);
};


baas.userLogout = function(args) {
	if (baas.config.debug) log.debug(logPrefix + 'userLogout, args: ' + JSON.stringify(args));
	baas.methods.userLogout(args);
};

baas.userLoggedIn = function(args) {
	if (baas.config.debug) log.debug(logPrefix + 'userLoggedIn, args: ' + JSON.stringify(args));
	baas.methods.userLoggedIn(args);
};

baas.userCreate = function(args) {
	if (baas.config.debug) log.debug(logPrefix + 'userCreate args: ' + JSON.stringify(args));	
	baas.methods.userCreate(args);
};

baas.sessionRestore = function() {
	if (baas.config.debug) log.debug(logPrefix + 'sessionRestore');
	baas.methods.sessionRestore();	
};

exports.baas = baas;
