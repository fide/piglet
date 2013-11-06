// Module debugging (CommonJS)

// Uses Titanium logging facilities with some consistent prefixes

var Alloy = require('Alloy');

// Required initialization method
function init() {
	var hub = this.hub;
	
	// configure messages to listen for
	hub.listen('event', function(eventData) {
		// don't display log-* events
		if (eventData.type.slice(0,4) != 'log-') {
			hub.logDebug('Event Monitor: ' + JSON.stringify(eventData));
		}
	});
	
	hub.logDebug('EventMonitor: module started');
}

exports.public = {
	init: init
}