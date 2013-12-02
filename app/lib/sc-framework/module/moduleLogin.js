// Login module (CommonJS)

// configuration gets merged in from module startup to object 'config'

var Alloy = require('Alloy');
var _ = require('Alloy/underscore')._;

vars = {
	// defaults
	debug: false
};

var logPrefix ='Login: ';
var win;
var ctl;

// Required initialization method
function init () {
	if (this.hasOwnProperty('debug')) vars.debug = this.debug;
	if (vars.debug) this.hub.logDebug(logPrefix + 'debugging enabled');;
	
	ctl = Alloy.createController('login', {debug: vars.debug});
	win = ctl.getView();
	
	// extend controller with access to Hub
	_.extend(ctl, {hub: Alloy.Globals.Kernel.hub.get('main')});
	
	if (vars.debug) this.hub.logDebug(logPrefix + 'module started');
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
