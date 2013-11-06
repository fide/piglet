// Login controller

vars = {};

function setDebug(flag) {
	vars.debug = flag;
	$.hub.logDebug('Login: debugging ' + ((vars.debug) ? 'enabled' : 'disabled'));
}

function init() {	
	vars.debug = true;
	
	vars.entryState;
	vars.textHeight = '40dp';
	
	Ti.App.addEventListener('got_user', function(user) {
		$.hub.logDebug('Login: handling app event: got_user');
		Alloy.Globals.currentUser = user;
		$.hub.broadcast('user-acquired', user);
		//launchMap();
	});

	Ti.App.addEventListener('need_user', function() {
		if (vars.debug) $.hub.logDebug('Login: handling app event: need_user');
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
	$.hub.sessionRestore();		// restore session if available, otherwise starts login procedure
	
	$.loginWindow.open(arg);
}

exports.close = function () {
	$.loginWindow.close();
}

/*
function destroy() {

}
*/

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

function userCallback(resp) {
	if (resp.success === true) {
		Alloy.Globals.currentUser = resp.user;
		launchMap();
	} else {
        alert(JSON.stringify(resp));
		$.tapper.enabled = true;
	}
};

init();
