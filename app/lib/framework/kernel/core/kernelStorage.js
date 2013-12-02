// Kernel storage (CommonJS)

var Alloy = require('Alloy');

exports.storage = {
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
