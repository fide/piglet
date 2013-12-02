// Scalability framework initialization (CommonJS)

var Alloy = require('Alloy');

function init () {
	if (OS_IOS) {
		// Function to test if device is iOS 7 or later
		function isIOS7Plus() {
			// iOS-specific test
			if (Titanium.Platform.name == 'iPhone OS') {
				var version = Titanium.Platform.version.split(".");
				var major = parseInt(version[0],10);

				// Can only test this support on a 3.2+ device
				if (major >= 7)
				{
					return true;
				}
			}
			return false;
		}
		
		if (isIOS7Plus() == true) {
			Alloy.CFG.isIOS7Plus = true;
			
			var statusBarHeight = 20;	// from IOS documentation
			Alloy.CFG.winTopOffset = statusBarHeight;		
		} else {
			Alloy.CFG.isIOS7Plus = false;
			Alloy.CFG.winTopOffset = 0;
		}
		
		Ti.UI.setBackgroundColor('#dcdcdc');	// used to set window default background color
	}
	
	// ---------------------------------------------------------------------------------------
	
	// Initialize core aspects of scalability framework
	require('sc-framework/kernel/core/kernelCoreInit').init();
	
	// ---------------------------------------------------------------------------------------

	// Initialize app specific aspects
	
	Alloy.Globals.currentUser = null;

	if (OS_ANDROID) {
		Alloy.Globals.Map = require('ti.map');
	}
	
	var Kernel = Alloy.Globals.Kernel;
	var Hub = Kernel.hub.get('main');
	
	// Define modules
	Kernel.module.define('moduleLogin', require('sc-framework/module/moduleLogin').public);
	Kernel.module.define('moduleMapView', require('sc-framework/module/moduleMapView').public);
	Kernel.module.define('moduleDetailView', require('sc-framework/module/moduleDetailView').public);

	// Register modules
	Kernel.register('mLogin', 'moduleLogin');
	Kernel.register('mMapView', 'moduleMapView');
	Kernel.register('mDetailView', 'moduleDetailView');
	
	Hub.broadcast('framework-initialized');		
}

exports.init = init;

