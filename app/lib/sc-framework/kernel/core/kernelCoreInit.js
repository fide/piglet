// Scalability framework core startup code

var Alloy = require('Alloy');

function init () {
	//---------------------------------------------------------------------------------------
	
	// Create Kernel object and store on Alloy.Globals
	var Kernel = Alloy.Globals.Kernel = require('sc-framework/base/core/kernel');

	// Add core Kernel extensions
	Kernel.extend(Kernel, {log: require('sc-framework/kernel/core/kernelLogging').log}, true);
	Kernel.extend(Kernel, {baas: require('sc-framework/kernel/core/kernelBaaS').baas}, true);
	Kernel.extend(Kernel, {keyobject: require('sc-framework/kernel/core/kernelKeyObject').keyobject}, true);
	Kernel.extend(Kernel, {sqldb: require('sc-framework/kernel/core/kernelSqlDb').sqldb}, true);
	
	// Define privileged hub
	Kernel.hub.define('privileged', {});

	// Add hub extensions
	var Hub = Kernel.hub.get('main');
	Kernel.extend(Hub, require('sc-framework/hub/core/hubExtensions').log, true);
	Kernel.extend(Hub, require('sc-framework/hub/core/hubExtensions').baas, true);
	Kernel.extend(Hub, require('sc-framework/hub/core/hubExtensions').keyobject, true);
	Kernel.extend(Hub, require('sc-framework/hub/core/hubExtensions').sqldb, true);
	
	// Add privileged hub extensions
	var HubPrivileged = Kernel.hub.get('privileged');
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').log, true);
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').baas, true);
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').baas_priv, true);
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').keyobject, true);
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').keyobject_priv, true);
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').sqldb, true);
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').sqldb_priv, true);
	Kernel.extend(HubPrivileged, require('sc-framework/hub/core/hubExtensions').lifecycle, true);
		
	// Define modules
	//Kernel.module.define('moduleConsoleLogger', require('sc-framework/module/core/moduleConsoleLogger').public);
	Kernel.module.define('moduleEventMonitor', require('sc-framework/module/core/moduleEventMonitor').public);
	Kernel.module.define('moduleAppManager', require('sc-framework/module/moduleAppManager').public);


	// Register modules
	//Kernel.register('mConsoleLogger', 'moduleConsoleLogger');
	Kernel.register('mEventMonitor', 'moduleEventMonitor');
	Kernel.register('mAppManager', 'moduleAppManager', 'privileged');	// connects to privileged hub
	
	// start modules
	Kernel.start('mEventMonitor');
	Kernel.start('mAppManager', {debug:true});
}

exports.init = init;
