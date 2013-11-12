// BaaS ACS methods (CommonJS)
// compatible with kernelBaaS I/O conventions

var acs = require('acs');
var logPrefix ='BaasACS: ';

var debug = false;	// local debug support

var log = {
		info: function(arg) { Ti.API.info(arg);},
		debug: function(arg) { Ti.API.debug(arg);},
		error: function(arg) { Ti.API.error(arg);},
};

var methods = {};

methods.setDebug = function(_debug) {
	debug = _debug;
}

methods.setLog = function(_log) {
	log = _log;
};

methods.userLogin = function(args) {	
	acs.loginUser(args.username, args.password, function(e) {
		resp = {
			method: 'userLogin',
			success: e.success,
			error: e.error.error,
			err_code: e.error.code,
			err_msg: e.error.message,
			user: e.user
		};
		
		if (debug) log.debug(logPrefix + 'response: ' + JSON.stringify(resp));
        			
		if (args.callback) {
			args.callback(resp);
		}
	});
};

methods.userCreate = function(args) {	
	acs.createUser(args.username, args.password, function(e) {
		resp = {
			method: 'userCreate',
			success: e.success,
			error: e.error.error,
			err_code: e.error.code,
			err_msg: e.error.message,
			user: e.user
		};
		
		if (debug) log.debug(logPrefix + 'response: ' + JSON.stringify(resp));
        
		if (args.callback) {
			args.callback(resp);
		}
	});
};

methods.sessionSave = function(args) {
	
};

methods.sessionRestore = function(args) {
	acs.restoreSession();
};

exports.methods = methods;
