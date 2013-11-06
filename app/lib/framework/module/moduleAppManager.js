// Application manager module (CommonJS)

var Alloy = require('Alloy');

vars = {};

function setDebug(flag) {
	vars.debug = flag;
	this.hub.logDebug('AppManager: debugging ' + ((vars.debug) ? 'enabled' : 'disabled'));
}

// Required initialization method
function init () {
	vars.debug = true;
	
	var hub = this.hub;
	
	if (vars.debug) hub.logDebug('AppManager: module started');
}

exports.public = {
	init: init
}
