// BaaS kernel extension (CommonJS)

var Alloy = require('Alloy');
var log = require('./kernelLogging').log;

// types supported: 'acs'
var baasType = 'acs';

var baas = {};
baas.debug = false;

switch (baasType) {
case 'acs':
	var acs = require('acs');
	
	baas.setDebug = function(flag) {
		baas.debug = flag;
		log.debug('BaaS: debugging ' + ((baas.debug) ? 'enabled' : 'disabled'));
	}
	
	baas.userLogin = function(args) {
		if (baas.debug) log.debug('BaaS: userLogin, args: ' + JSON.stringify(args));
		
		acs.loginUser(args.username, args.password, function(e) {
			resp = {
				method: 'userLogin',
				success: e.success,
				error: e.error.error,
				err_code: e.error.code,
				err_msg: e.error.message,
				user: e.user
			};
			
			if (baas.debug) log.debug('BaaS response: ' + JSON.stringify(resp));
	        			
			if (args.callback) {
				args.callback(resp);
			}
		});
	};
	
	baas.userCreate = function(args) {
		if (baas.debug) log.debug('BaaS: userCreate, args: ' + JSON.stringify(args));
		
		acs.createUser(args.username, args.password, function(e) {
			resp = {
				method: 'userCreate',
				success: e.success,
				error: e.error.error,
				err_code: e.error.code,
				err_msg: e.error.message,
				user: e.user
			};
			
			if (baas.debug) log.debug('BaaS response: ' + JSON.stringify(resp));
	        
			if (args.callback) {
				args.callback(resp);
			}
		});
	};
	
	baas.sessionSave = function() {
		
	};
	
	baas.sessionRestore = function() {
		if (baas.debug) log.debug('BaaS: sessionRestore');
		acs.restoreSession();
	};
	
	baas.initialized = true;
	break;
default:
	log.error('BaaS: invalid type specified.');
}

exports.baas = baas;
