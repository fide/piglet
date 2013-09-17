/*
	Library to wrap app-specific functionality around the ACS APIs
*/

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
	        Ti.API.error('login error:\n' +  ((e.error && e.message) || JSON.stringify(e)));
	        alert('Login error: ' + ((e.error && e.message) || JSON.stringify(e)))
	        
	        currentUser = null;
	        loggedIn = false;
	        
	        rtnVal.error = JSON.stringify(e);
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
	        Ti.API.error('login error:\n' +  ((e.error && e.message) || JSON.stringify(e)));
	        alert('Login error: ' + JSON.stringify(e))
	        
	        currentUser = null;
	        loggedIn = false;
	        
	        rtnVal.error = JSON.stringify(e);
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
	        
	        rtnVal.error = JSON.stringify(e);
	        callback(rtnVal);
	    }
	});
};

/*
// Add saveFugitive() here, accepts a fugitive object, store the 
// custom object in a class named 'fugitive'
// check logged in state, Ti.API.info() out a success/failure message
exports.saveFugitive = function(fugitive, callback) {
	if (loggedIn === true) {
		Cloud.Objects.update ({
		    classname: 'fugitive',
		    id: fugitive.acs_id,
		    fields: {
				'name': fugitive.name,
				'captured': fugitive.captured,
				'url': fugitive.url,
				'capturedLat': fugitive.capturedLat,
				'capturedLon': fugitive.capturedLon
		    }
		}, function (e) {
		    if (e.success) {
		        var fugitive = e.fugitive[0];
		        Ti.API.debug('save fugitive success:\n' +
			        'id: ' + fugitive.id + '\n' +
			        'name: ' + fugitive.name + '\n' +
		            'captured: ' + fugitive.captured + '\n' +
		            'url: ' + fugitive.url + '\n' +
		            'capturedLat: ' + fugitive.capturedLat + '\n' +
		            'capturedLon: ' + fugitive.capturedLon + '\n' +
		            'created_at: ' + fugitive.created_at
		        );
		        
		        if (callback) callback(true);
		    } else {
		        Ti.API.error('save fugitive error: ' + ((e.error && e.message) || JSON.stringify(e)));
		        alert('Save fugitive error: ' + ((e.error && e.message) || JSON.stringify(e)))
		        
		        if (callback) callback(false);
		    }
		});
	} else {
		Ti.API.debug('updating fugitive - must be logged in');
		alert ('Must be logged in');	}
};

exports.createFugitive = function(fugitive, callback) {
	if (loggedIn === true) {
		Cloud.Objects.create ({
		    classname: 'fugitive',
		    fields: {
				'name': fugitive.name,
				'captured': fugitive.captured,
				'url': fugitive.url,
				'capturedLat': fugitive.capturedLat,
				'capturedLon': fugitive.capturedLon
		    },
		    user_id: Alloy.Globals.user
		}, function (e) {
		    if (e.success) {
		        var fugitive = e.fugitive[0];
		        Ti.API.debug('create fugitive success:\n' +
			        'id: ' + fugitive.id + '\n' +
			        'name: ' + fugitive.name + '\n' +
		            'captured: ' + fugitive.captured + '\n' +
		            'url: ' + fugitive.url + '\n' +
		            'capturedLat: ' + fugitive.capturedLat + '\n' +
		            'capturedLon: ' + fugitive.capturedLon + '\n' +
		            'created_at: ' + fugitive.created_at
		        );
		        
		        if (callback) callback(fugitive);
		    } else {
		        Ti.API.error('create fugitive error: ' + ((e.error && e.message) || JSON.stringify(e)));
		        alert('Create fugitive error: ' + ((e.error && e.message) || JSON.stringify(e)))
		        
		        if (callback) callback(false);
		    }
		});
	} else {
		Ti.API.debug('creating fugitive - must be logged in');
		alert ('Must be logged in');
	}
};

exports.deleteFugitive = function(fugitive, callback) {
	if (loggedIn === true) {
		Cloud.Objects.remove ({
		    classname: 'fugitive',
		    id: fugitive.acs_id
		}, function (e) {
		    if (e.success) {
		        Ti.API.debug('delete fugitive success');
		        if (callback) callback(true);
		    } else {
		        Ti.API.error('delete fugitive error: ' + ((e.error && e.message) || JSON.stringify(e)));
		        alert('Delete fugitive error: ' + ((e.error && e.message) || JSON.stringify(e)))
		        if (callback) callback(false);
		    }
		});
	} else {
		Ti.API.debug('deleting fugitive - must be logged in');
		alert ('Must be logged in');
	}
};

exports.getFugitives = function(user, callback) {
	if (loggedIn === true) {
		Cloud.Objects.query ({
		    classname: 'fugitive',
		    where: {user_id: user.id},
		    order: 'username',
		    response_json_depth: 1,
		    limit: 1000
		}, function (e) {
		    if (e.success) {
		        if (callback) callback(e);
		    } else {
		        Ti.API.error('get fugitives error: ' + ((e.error && e.message) || JSON.stringify(e)));
		        if (callback) callback(false);
		    }
		});
	} else {
		Ti.API.debug('getting fugitives - must be logged in');
	}
};
*/