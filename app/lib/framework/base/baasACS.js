// BaaS ACS methods (CommonJS)
// compatible with kernelBaaS I/O conventions

var Cloud = require('ti.cloud');
var logPrefix ='BaasACS: ';

var debug = false;	// local debug support
var loggedIn = false;

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
	var username = args.username,
		password = args.password,
		callback = args.callback;

	function respond(e) {
		var resp = {
			method: 'userLogin',
			success: e.success,
			error: e.error.error,
			err_code: e.error.code,
			err_msg: e.error.message,
			user: e.user
		};
			
		if (debug) log.debug(logPrefix + 'response: ' + JSON.stringify(resp));
	    
		if (callback) {
			callback(resp);
		}
	}
	
	Cloud.Users.login({
	    login: username,
	    password: password
	}, function (e) {
		var rtnVal = {success:false, error:''};
		
	    if (e.success) {
	        var currentUser = e.users[0];
	        
	        var session = {
	        	id: currentUser.id,
	        	username: currentUser.username,
	        	sessionid: Cloud.sessionId
	        };
	        
	        Ti.App.Properties.setObject('session', session);
		        
			if (debug) log.debug(logPrefix + 'login sucess: ' + JSON.stringify(session));
	        
	        loggedIn = true;
	        
	        rtnVal.success = true;
	        rtnVal.user = currentUser;
	        respond(rtnVal);
	    } else {
	        currentUser = null;
	        loggedIn = false;
	        
	        rtnVal.error = e;
	        respond(rtnVal);
	    }
	});
}

methods.userLogout = function(args) {	
	var username = args.username,
		callback = args.callback;

	function respond(e) {
		var resp = {
			method: 'userLogout',
			success: e.success,
			error: e.error.error,
			err_code: e.error.code,
			err_msg: e.error.message,
			user: e.user
		};
	
		if (debug) log.debug(logPrefix + 'response: ' + JSON.stringify(resp));
	    
		if (callback) {
			callback(resp);
		}
	}
	
	Cloud.Users.logout(function (e) {
		var rtnVal = {success:false, error:''};
		
	    if (e.success) {
			if (debug) log.debug(logPrefix + 'logout success');
					
			loggedIn = false;
			Alloy.Globals.currentUser = null;
			
			// remove session
			Ti.App.Properties.removeProperty('session');

			rtnVal.success = true;
			respond(rtnVal);
	    } else {
			log.error(logPrefix + 'logout error: ' +  ((e.error && e.message) || JSON.stringify(e)));
	        
	        rtnVal.error = e;
	        respond(rtnVal);
	    }
	});
}

methods.isLoggedIn = function(args) {
	return loggedIn;
};

// ACS API requires password & confirm, but we do the checking elsewhere
methods.userCreate = function(args) {
	var username = args.username,
		password = args.password,
		callback = args.callback;
	
	function respond(e) {
		var resp = {
			method: 'userCreate',
			success: e.success,
			error: e.error.error,
			err_code: e.error.code,
			err_msg: e.error.message,
			user: e.user
		};
		
		if (debug) log.debug(logPrefix + 'response: ' + JSON.stringify(resp));
        
		if (callback) {
			callback(resp);
		}
	}
	
	Cloud.Users.create({
	    username: username,
	    password: password,
	    password_confirmation: password
	}, function (e) {
		var rtnVal = {success:false, error:''};
		
	    if (e.success) {
	        var currentUser = e.users[0];
	        
	        var session = {
	        	id: currentUser.id,
	        	username: currentUser.username,
	        	sessionid: Cloud.sessionId
	        };
	        
	        Ti.App.Properties.setObject('session', session);
	        
			if (debug) log.debug(logPrefix + 'login success: ' + JSON.stringify(session));
	        
	        loggedIn = true;
	        
	        rtnVal.success = true;
	        rtnVal.user = currentUser;
	        respond(rtnVal);
	    } else {
	        currentUser = null;
	        loggedIn = false;
	        
	        rtnVal.error = e;
	        respond(rtnVal);
	    }
	});
};

methods.sessionRestore = function(args) {
	var session = Ti.App.Properties.getObject('session');

	// Check for existing ACS session and restore if available. 	
	if (session) {
		Cloud.sessionId = session.sessionid;
		var me = Cloud.Users.showMe(function(e) {
			if (e.success === true) {
				loggedIn = true;
				Ti.App.fireEvent('got_user', e.users[0]);
			} else {
				Ti.App.Properties.removeProperty('session');
				if (debug) log.debug(logPrefix + 'unable to validate cached session_id: ' + e.message);
				Ti.App.fireEvent('need_user');
			}
		});
	} else {
		Ti.App.fireEvent('need_user');
	}
};

exports.methods = methods;
