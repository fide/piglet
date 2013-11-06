// Application manager module (CommonJS)

var Alloy = require('Alloy');

vars = {};
var logPrefix ='AppManager: ';

function setDebug(flag) {
	vars.debug = flag;
	this.hub.logDebug(logPrefix + 'debugging ' + ((vars.debug) ? 'enabled' : 'disabled'));
}

// Required initialization method
function init () {
	vars.debug = true;
	
	var hub = this.hub;
		
	// configure messages to listen for
	hub.listen('event', function(eventData) {
		switch (eventData.type) {
		case 'framework-initialized':
			hub.logDebug(logPrefix + 'starting Login module');
			hub.moduleStart('mLogin');
			break;
		}
	});
	
	if (vars.debug) hub.logDebug(logPrefix + 'module started');
}

exports.public = {
	init: init
}
