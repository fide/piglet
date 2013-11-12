// Application manager module (CommonJS)

var Alloy = require('Alloy');

vars = {};
var logPrefix ='AppManager: ';

function setDebug(flag) {
	vars.debug = flag;
	this.hub.logDebug(logPrefix + 'debugging ' + ((vars.debug) ? 'enabled' : 'disabled'));
}


function launchMap() {
	var win = Alloy.createController('mapview').getView();
	
	var hub = this.hub;
	
	if (win) {
		var arg = {};
		if (OS_ANDROID) {
			arg.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
			arg.activityExitAnimation = Ti.Android.R.anim.slide_out_right;			
		};
		win.open(arg);
	}
}

// Required initialization method
function init () {
	vars.debug = true;
	
	var hub = this.hub;
	
	// configure use of ACS for BaaS
	hub.setBaasConfig({type: 'acs'});
		
	// configure messages to listen for
	hub.listen('event', function(eventData) {
		switch (eventData.type) {
		case 'framework-initialized':
			hub.logDebug(logPrefix + 'starting Login module');
			hub.moduleStart('mLogin');
			break;
		case 'user-acquired':
			hub.logDebug(logPrefix + 'starting MapView module');
			launchMap();
			
			hub.logDebug(logPrefix + 'stopping Login module');
			hub.moduleStop('mLogin');
			break;
		}
	});
	
	if (vars.debug) hub.logDebug(logPrefix + 'module started');
}

exports.public = {
	init: init
}
