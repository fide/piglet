var acs = require('acs');

var entryState = 'login';
const textHeight = '40dp';

Ti.App.addEventListener('got_user', function(user) {
	Ti.API.debug('Handling app event: got_user');
	Alloy.Globals.currentUser = user;
	launchMap();
});

Ti.App.addEventListener('need_user', function() {
	Ti.API.debug('Handling app event: need_user');
	$.viewLogin.visible = true;
});

function launchMap() {
	var win = Alloy.createController('mapview').getView();
	
	if (win) {
		var arg = {};
		if (OS_ANDROID) {
			arg.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
			arg.activityExitAnimation = Ti.Android.R.anim.slide_out_right;			
		};
		win.open(arg);
		$.index.close();
	}
}

function cb(e) {
	if (e.success === true) {
		Alloy.Globals.currentUser = e.user;
		launchMap();
	} else {
		$.tapper.enabled = true;
	}
};

$.tapper.addEventListener('click', function() {
	$.tapper.enabled = false;

	// hide keyboard
	$.username.blur();
	$.password.blur();
	$.confirm.blur();
	
	if (entryState === 'login') {
		acs.loginUser($.username.value, $.password.value, cb);		
	} else {
		acs.createUser($.username.value, $.password.value, cb);
	}
});

$.labelAction.addEventListener('click', function() {	
	if (entryState === 'login') {
		$.confirm.height = textHeight;
		$.tapper.title = 'Sign Up';
		this.text = 'Login Existing User?'
		entryState = 'signup';
	} else {
		$.confirm.height = 0;
		$.tapper.title = 'Log In';
		this.text = 'Create New Account?'
		entryState = 'login';	}
});

$.index.open();

acs.restoreSession();	// restore session if available, otherwise starts login procedure
