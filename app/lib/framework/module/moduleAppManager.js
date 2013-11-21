// Application manager module (CommonJS)

var Alloy = require('Alloy');

vars = {
	//defaults
	debug: false
};

var logPrefix ='AppManager: ';

exports.public = {
	init: init
}

// Required initialization method
function init () {
	if (this.hasOwnProperty('debug')) vars.debug = this.debug;
	if (vars.debug) this.hub.logDebug(logPrefix + 'debugging enabled');
	
	var hub = this.hub;
	hub.debug = vars.debug;
	
	// configure use of ACS for BaaS
	hub.setBaasConfig({debug: true, type: 'acs'});
	
	// configure use of local property storage for key/objects
	hub.setKeyObjectConfig({debug:true, type: 'local'});
		
	// configure messages to listen for
	hub.listen('event', function(eventData) {
		switch (eventData.type) {
		case 'framework-initialized':
			if (hub.debug) hub.logDebug(logPrefix + 'starting Login module');
			hub.moduleStart('mLogin', {debug: true});
			break;
		case 'user-acquired':
			if (hub.debug) hub.logDebug(logPrefix + 'starting MapView module');
			launchMap();
			
			if (hub.debug) hub.logDebug(logPrefix + 'stopping Login module');
			hub.moduleStop('mLogin');
			break;
		}
	});
	
	if (vars.debug) hub.logDebug(logPrefix + 'module started');
	
	
	// play with database
	hub.setDbConfig({debug: true, type: 'local'});
	hub.dbOpen('foobar', function(db) {
		hub.logDebug('database opened');
	});
}

function launchMap() {
	var win = Alloy.createController('mapview').getView();
	
	if (win) {
		var arg = {};
		if (OS_ANDROID) {
			arg.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
			arg.activityExitAnimation = Ti.Android.R.anim.slide_out_right;			
		};
		win.open(arg);
	}
}
