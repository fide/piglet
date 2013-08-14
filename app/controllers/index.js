var acs = require('acs');

var entryState = 'login';

const textHeight = '40dp';

function do_click(e) {
    alert(this.text);
}

/*
// Event handler for orientation changes to re-orient primary container view
Ti.Gesture.addEventListener('orientationchange', function (ev) {
    if (Ti.Gesture.isLandscape(ev.orientation)) {
      // Update your UI for landscape orientation
    	$.primary.layout="horizontal";
    	$.fragment1.height="100%";
    	$.fragment1.width="50%";
//    	$.fragment2.height="100%";
//    	$.fragment2.width="50%";
    } else {
      // Update your UI for portrait orientation
    	$.primary.layout="vertical";
    	$.fragment1.height="50%";
    	$.fragment1.width="100%";
//    	$.fragment2.height="50%";
//    	$.fragment2.width="100%";
    }
  });

// Initialize layout based on orientation
if (Ti.Gesture.isPortrait() === true) {
	$.primary.layout="vertical";
	$.fragment1.height="50%";
	$.fragment1.width="100%";
//	$.fragment2.height="50%";
//	$.fragment2.width="100%";
} else {
	$.primary.layout="horizontal";
	$.fragment1.height="100%";
	$.fragment1.width="50%";
//	$.fragment2.height="100%";
//	$.fragment2.width="50%";
}
*/

function callback() {
	if(acs.isLoggedIn() === true) {
		alert ('Success');
		$.tapper.enabled = true;
		var win = Alloy.createController('mapview').getView();
		win.open();
		this.close();
	} else {
		alert('Oopsie, something went wrong.');
		$.tapper.enabled = true;
	}
}

$.tapper.addEventListener('click', function() {
	$.tapper.enabled = false;
	
	if (entryState === 'login') {
		acs.login($.username.value, $.password.value, callback);		
	} else {
		acs.createUser($.username.value, $.password.value, callback);
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
