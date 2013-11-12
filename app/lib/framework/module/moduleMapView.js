// MapView module (CommonJS)

var Alloy = require('Alloy');

vars = {
	// defaults
	debug: false
};

var logPrefix ='MapView: ';
var win;
var ctl;

// Required initialization method
function init() {	
	if (this.hasOwnProperty('debug')) vars.debug = this.debug;
	if (vars.debug) this.hub.logDebug(logPrefix + 'debugging enabled');;
	
	ctl = Alloy.createController('mapview');
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
