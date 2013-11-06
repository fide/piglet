// Login module (CommonJS)

var Alloy = require('Alloy');
var _ = require('Alloy/underscore');

vars = {};
var win;
var ctl;

function setDebug(flag) {
	vars.debug = flag;
	this.hub.logDebug('Login: debugging ' + ((vars.debug) ? 'enabled' : 'disabled'));
}

// Required initialization method
function init () {
	vars.debug = false;
	
	ctl = Alloy.createController('login');
	win = ctl.getView();
	_.extend(ctl, {hub: Alloy.Globals.Kernel.hub.get('main')});
	
	if (vars.debug) this.hub.logDebug('Login: module started');
	vars.state = 'initialized';
	
	open();
}

function open() {
	if (vars.state == 'initialized') {

		if (win) {
			var arg = {};
/*
			if (OS_ANDROID) {
				arg.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
				arg.activityExitAnimation = Ti.Android.R.anim.slide_out_right;			
			};
*/
			
			ctl.open(arg);
		}
		
		vars.state = 'open';
	}
}

function close() {
	if (vars.state == 'open') {
		ctl.close();
	}
	
	vars.state = 'null';
}

exports.public = {
	init: init,
	open: open,
	close: close
}
