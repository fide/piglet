// BaaS kernel extension (CommonJS)

var Alloy = require('Alloy');
var log = require('framework/kernel/kernelLogging').log;
var logPrefix ='BaaS: ';

var baas = {
	config: {}
};

// set up defaults ----------------------
baas.methods = {
	setDebug: function(debug, args) { log.error(logPrefix + 'setDebug: unimplemented'); },
	setLog: function(debug, args) { log.error(logPrefix + 'setLog: unimplemented'); },
	userLogin: function(debug, args) { log.error(logPrefix + 'userLogin: unimplemented'); },
	userCreate: function(debug, args) { log.error(logPrefix + 'userCreate: unimplemented'); },
	sessionSave: function(debug, args) { log.error(logPrefix + 'sessionSave: unimplemented'); },
	sessionRestore: function(debug, args) { log.error(logPrefix + 'sessionRestore: unimplemented'); }
};
// --------------------------------------

baas.debug = false;
	
baas.setConfig = function(config) {
	var _ = require('Alloy/underscore')._;
	_.extend(baas.config, config);

	switch (baas.config.type) {
	case 'acs':
		baas.methods = require('framework/base/baasACS').methods;
		baas.methods.setDebug(baas.debug);
		baas.methods.setLog(log);
		break;
	default:
		log.error(logPrefix + 'setConfig, invalid type: ' + baas.type);
		break;
	}
}

baas.setDebug = function(flag) {
	baas.debug = flag;
	baas.methods.setDebug(baas.debug);
	log.debug(logPrefix + 'debugging ' + ((baas.debug) ? 'enabled' : 'disabled'));
}

baas.userLogin = function(args) {
	if (baas.debug) log.debug(logPrefix + 'userLogin, args: ' + JSON.stringify(args));
	baas.methods.userLogin(args);
};

baas.userCreate = function(args) {
	if (baas.debug) log.debug(logPrefix + 'userCreate args: ' + JSON.stringify(args));	
	baas.methods.userCreate(args);
};

baas.sessionSave = function(args) {
	if (baas.debug) log.debug(logPrefix + 'sessionSave args: ' + JSON.stringify(args));
	baas.methods.sessionSave(args);	
};

baas.sessionRestore = function() {
	if (baas.debug) log.debug(logPrefix + 'sessionRestore');
	baas.methods.sessionRestore();	
};

exports.baas = baas;
