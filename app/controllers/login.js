// Login controller

vars = {};
var logPrefix ='Login: ';

function setDebug(flag) {
	vars.debug = flag;
	$.hub.logDebug(logPrefix + 'debugging ' + ((vars.debug) ? 'enabled' : 'disabled'));
}

function init() {	
	vars.debug = true;
	
	vars.entryState = 'login';
	vars.textHeight = '40dp';
	
	Ti.App.addEventListener('got_user', function(user) {
		Alloy.Globals.currentUser = user;
		$.hub.broadcast('user-acquired', user);
	});

	Ti.App.addEventListener('need_user', function() {
		if (vars.debug) $.hub.logDebug(logPrefix + 'handling app event: need_user');
		$.viewLogin.visible = true;	
	});

	$.tapper.addEventListener('click', function() {
		$.tapper.enabled = false;
		
		// hide keyboard
		$.username.blur();
		$.password.blur();
		$.confirm.blur();
		
		if (vars.entryState === 'login') {
			$.hub.userLogin($.username.value, $.password.value, userCallback);
		} else {
			$.hub.userCreate($.username.value, $.password.value, userCallback);			
		}
	});

	$.labelAction.addEventListener('click', function() {	
		if (vars.entryState === 'login') {
			$.confirm.height = vars.textHeight;
			$.tapper.title = 'Sign Up';
			this.text = 'Login Existing User?'
			vars.entryState = 'signup';
		} else {
			$.confirm.height = 0;
			$.tapper.title = 'Log In';
			this.text = 'Create New Account?'
			vars.entryState = 'login';
		}
	});
};

exports.open = function (arg) {
	// Restore session if available, otherwise starts login procedure.
	// This can't go in init() because the controller has not yet been
	// extended with the framework's hub.
	$.hub.sessionRestore();
	
	$.loginWindow.open(arg);
}

exports.close = function () {
	$.loginWindow.close();
}

/*
function destroy() {

}
*/

function userCallback(resp) {
	if (resp.success === true) {
		Alloy.Globals.currentUser = resp.user;
		$.hub.broadcast('user-acquired', resp.user);
	} else {
        alert(JSON.stringify(resp));
		$.tapper.enabled = true;
	}
};

init();
