
// Library to wrap app-specific functionality around the ACS APIs

var loggedIn = false;

var Alloy = require('alloy');
var Cloud = require('ti.cloud');
//Cloud.debug = true;

exports.restoreSession = function() {
	// Check for existing ACS session and restore if available. 
	var sid = Ti.App.Properties.getString('sessionid');
	if(sid) {
		Cloud.sessionId = sid;
		var me = Cloud.Users.showMe(function(e) {
			if (e.success === true) {
				loggedIn = true;
				Ti.App.fireEvent('got_user', e.users[0]);
			} else {
				Ti.App.Properties.removeProperty('sessionid');
				Ti.API.info('unable to validate cached session_id: ' + e.message);
				Ti.App.fireEvent('need_user');
			}
		});
	} else {
		Ti.App.fireEvent('need_user');
	}
};

exports.isLoggedIn = function() {
	return loggedIn;
};

// ACS API requires password & confirm, but we do the checking elsewhere so use the same for both here
exports.createUser = function(username, password, callback) {
	Cloud.Users.create({
	    username: username,
	    password: password,
	    password_confirmation: password
	}, function (e) {
		rtnVal = {success:false, error:''};
		
	    if (e.success) {
	        var currentUser = e.users[0];
	        Ti.API.debug('login success:\n' +
	            'id: ' + currentUser.id + '\n' +
	            'sessionId: ' + Cloud.sessionId + '\n' +
	            'username: ' + currentUser.username
	        );
	        
	        loggedIn = true;
	        
	        // save sessionID
	        Ti.App.Properties.setString('sessionid', Cloud.sessionId);
	        
	        rtnVal.success = true;
	        rtnVal.user = currentUser;
	        callback(rtnVal);
	    } else {
	        currentUser = null;
	        loggedIn = false;
	        
	        rtnVal.error = e;
	        callback(rtnVal);
	    }
	});
};

exports.loginUser = function(username, password, callback) {
	Cloud.Users.login({
	    login: username,
	    password: password
	}, function (e) {
		rtnVal = {success:false, error:''};
		
	    if (e.success) {
	        var currentUser = e.users[0];
	        Ti.API.debug('login success:\n' +
	            'id: ' + currentUser.id + '\n' +
	            'sessionId: ' + Cloud.sessionId + '\n' +
	            'username: ' + currentUser.username
	        );
	        
	        loggedIn = true;
	        
	        // save sessionID
	        Ti.App.Properties.setString('sessionid', Cloud.sessionId);
	        
	        rtnVal.success = true;
	        rtnVal.user = currentUser;
	        callback(rtnVal);
	    } else {
	        currentUser = null;
	        loggedIn = false;
	        
	        rtnVal.error = e;
	        callback(rtnVal);
	    }
	});
};

exports.logoutUser = function(callback) {
	Cloud.Users.logout(function (e) {
		rtnVal = {success:false, error:''};
		
	    if (e.success) {
			Ti.API.debug('logout success');
					
			loggedIn = false;
			Alloy.Globals.currentUser = null;
			
			// remove sessionID
			Ti.App.Properties.removeProperty('sessionid');

			rtnVal.success = true;
			callback(rtnVal);
	    } else {
	        Ti.API.error('logout error: ' +  ((e.error && e.message) || JSON.stringify(e)));
	        
	        rtnVal.error = e;
	        callback(rtnVal);
	    }
	});
};
