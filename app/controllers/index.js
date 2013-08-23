var acs = require('acs');

var entryState = 'login';

const textHeight = '40dp';

function do_click(e) {
    alert(this.text);
}

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
