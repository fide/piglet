/*
	Library to wrap app-specific functionality around the ACS APIs
*/

// a couple local variables to save state
var currentUser = null;
var loggedIn = false;

var Cloud = require('ti.cloud');

exports.isLoggedIn = function() {
	return loggedIn;
};

exports.login = function(username, password, callback) {
	/*
	 * Uses the ACS Users API to log in a user.
	 *   - upon successful login, sets currentUser equal to the user object returned by ACS
	 *   - and sets loggedIn=true. Then, calls the callback function, passing the loggedIn variable
	 *   - if login fails, writes the error message to the console, sets loggedIn=false and currentUser=null
	 *   - then calls the callback function passing the loggedIn variable
	 */
console.log(username, password)
	Cloud.Users.login({
	    login: username,
	    password: password
	}, function (e) {
	    if (e.success) {
	        currentUser = e.users[0];
	        loggedIn = true;
	        callback(loggedIn);
	    } else {
	        Ti.API.debug('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
	        currentUser = null;
	        loggedIn = false;
	        callback(loggedIn);
	    }
	});
};

exports.logout = function() {
	/*
	 * Uses the ACS Users API to log out the current user
	 *   - on success, sets currentUser=null and loggedIn=false
	 */
	
	Cloud.Users.logout(function (e) {
	    if (e.success) {
	        currentUser = null;
	        loggedIn = false;
	    } else {
	        Ti.API.debug('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

exports.createUser = function(username, password, callback) {
	/*
	 * Uses the ACS Users API to create a user with the given name & password
	 *   - on success, sets currentUser equal to the user object returned by ACS and set
	 *   - loggedIn=true, then calls the callback function passing the current user.
	 *   - on failure, logs a message to the console, sets loggedIn to false, current user to null
	 *   - and calls the callback function, passing false
	 */

	Cloud.Users.create({
	    username: username,
	    password: password,
	    password_confirmation: password
	}, function (e) {
	    if (e.success) {
	        currentUser = e.users[0];
	        loggedIn = true;
	        callback(currentUser);
	    } else {
	        Ti.API.debug('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
	        currentUser = null;
	        loggedIn = false;
	        callback(false);
	    }
	});
};

/*
exports.brag = function(message, callback) {
	/*
	 * Write a function that will use the ACS Statuses API to post a message for the logged in user
	 *   - pass a message, no other params are needed
	 *   - on success, call the callback function passing true
	 *   - on failure, log the error to the console, call callback() passing false
	*
	
	Cloud.Statuses.create({
	    message: message
	}, function (e) {
	    if (e.success) {
	        callback(true);
	    } else {
	        Ti.API.debug('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
	        callback(false);
	    }
	});
};

exports.getBragList = function(callback) {
	/*
	 * Write a function that will use the ACS Statuses API to retrieve a list of messages for the logged in user
	 *   - on success, call the callback function, passing the array of status messages returned by ACS
	 *   - on failure, log the error and call callback() passing false
	*
	
	Cloud.Statuses.query({
	    user_id: currentUser.id,
	    limit: 100
	}, function (e) {
	    if (e.success) {
	        callback(e.statuses);
	    } else {
	        Ti.API.debug('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
	        callback(false);
	    }
	});
};
*/