// Module console logger (CommonJS)

// Uses Titanium logging facilities with some consistent prefixes

var Alloy = require('Alloy');

function logInfo (text) {
	Ti.API.log((new Date()).toTimeString() + ': ' + text);
};

function logDebug (text) {
	Ti.API.debug((new Date()).toTimeString() + ': ' + text);
};

function logError(text) {
	Ti.API.error((new Date()).toTimeString() + ': ' + text);
};

//Required initialization method
function init() {
	// configure messages to listen for
	this.hub.listen('log-info', logInfo);
	this.hub.listen('log-debug', logDebug);
	this.hub.listen('log-error', logError);
}

exports.public = {
	init: init
}