// Hub extensions (CommonJS)

var Alloy = require('Alloy');
var Kernel = Alloy.Globals.Kernel;

// Logging support (both kernel and module broadcast)
exports.log = {
    logInfo: function(text) {    		
		Kernel.log.info(text);
		this.broadcast('log-info',text);
	},
    logDebug: function(text) {    		
		Kernel.log.debug(text);
		this.broadcast('log-debug',text);
	},
    logError: function(text) {    		
		Kernel.log.error(text);
		this.broadcast('log-error',text);
    }
};

// Key/Value support (values are JSON objects)
exports.keyobject = {
	setDebug: function(flag) {
		Kernel.keyobject.setDebug(flag);
	},
	getKeys: function() {
		Kernel.keyobject.getKeys(args);
	},
	getObject: function(args) {
		Kernel.keyobject.getObject(args);
	},
	setObject: function(args) {
		Kernel.keyobject.setObject(args);
	},	
	removeObject: function(args) {
		Kernel.keyobject.removeObject(args);
	}
}

// BaaS support
exports.baas = {
	setDebug: function(flag) {
		Kernel.baas.setDebug(flag);
	},
    userLogin: function(username, password, callback) { 
    	Kernel.baas.userLogin({
    		username: username,
    		password: password,
    		callback: callback
    	});
	},
    userLogout: function(username, callback) { 
    	Kernel.baas.userLogout({
    		username: username,
    		callback: callback
    	});
	},
    userLoggedIn: function() { 
    	Kernel.baas.userLoggedIn();
	},
	userCreate: function(username, password, callback) { 
    	Kernel.baas.userCreate({
    		username: username,
    		password: password,
    		callback: callback
    	});
    },
    sessionRestore: function() {
    	Kernel.baas.sessionRestore();
    }
};

// Extensions below here are privileged -------------------------------------------------

// BaaS support
exports.baas_priv = {
	setBaasConfig: function(config) {
		Kernel.baas.setConfig(config);
	}
};

// Key/Object support
exports.keyobject_priv = {
	setKeyObjectConfig: function(config) {
		Kernel.keyobject.setConfig(config);
	}
};

// Module life-cycle support
exports.lifecycle = {
	moduleStart: function(name, args) {
		if (!Kernel.module.isStarted(name)) {
			Kernel.start(name, args);
		}
	},
    moduleStop: function(name) { 
		if (Kernel.module.isStarted(name)) {
			Kernel.stop(name);
		}
	}
};
