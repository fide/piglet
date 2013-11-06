// Application startup code (called by alloy.js)

var Alloy = require('Alloy');

function main () {
	Alloy.Globals.currentUser = null;

	if (OS_ANDROID) {
		Alloy.Globals.Map = require('ti.map');
	}

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
	
	//---------------------------------------------------------------------------------------
	
	// Create Kernel object and store on Alloy.Globals
	var Kernel = Alloy.Globals.Kernel = require('framework/kernel');

	// Add Kernel extensions
	Kernel.extend(Kernel, {log: require('framework/kernel/kernelLogging').log}, true);
	Kernel.extend(Kernel, {baas: require('framework/kernel/kernelBaaS').baas}, true);
	
	var Hub = Kernel.hub.get('main');

	// Add Hub extensions
	Kernel.extend(Hub, require('framework/hub/hubMain').log, true);
	Kernel.extend(Hub, require('framework/hub/hubMain').baas, true);
	
	Kernel.baas.setDebug(true);
		
	// Define modules
	//Kernel.module.define('moduleConsoleLogger', require('framework/module/moduleConsoleLogger').public);
	Kernel.module.define('moduleEventMonitor', require('framework/module/moduleEventMonitor').public);
	Kernel.module.define('moduleLogin', require('framework/module/moduleLogin').public);
	Kernel.module.define('moduleMapView', require('framework/module/moduleMapView').public);
	Kernel.module.define('moduleDetailView', require('framework/module/moduleDetailView').public);

	// Register modules
	//Kernel.register('mConsoleLogger', 'moduleConsoleLogger');
	Kernel.register('mEventMonitor', 'moduleEventMonitor');
	Kernel.register('mLogin', 'moduleLogin');
	Kernel.register('mMapView', 'moduleMapView');
	Kernel.register('mDetailView', 'moduleDetailView');
	
	// start modules
	Kernel.start('mEventMonitor');
	Kernel.start('mLogin');
}

exports.main = main;