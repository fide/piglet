// Kernel logging (CommonJS)

// Uses Titanium logging facilities with some consistent prefixes

var Alloy = require('Alloy');

exports.log = {
	info: function (text) {
		Ti.API.log(text);
	},
	debug: function (text) {
		Ti.API.debug(text);
	},
	error: function (text) {
		Ti.API.error(text);
	}
}
