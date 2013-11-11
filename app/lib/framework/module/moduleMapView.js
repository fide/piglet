// MapView module (CommonJS)

var Alloy = require('Alloy');

// Required initialization method
function init() {
	this.hub.broadcast('log-debug','Module MapView started.')
}

exports.public = {
	init: init
}