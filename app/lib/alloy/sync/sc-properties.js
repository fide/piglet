var Alloy = require('alloy');
var _ = require("alloy/underscore")._;
var async = require('async');
var keyobject = require('framework/kernel/core/kernelKeyObject').keyobject;

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
   return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}

function Sync(method, model, opts) {
	var prefix = model.config.adapter.collection_name ? model.config.adapter.collection_name : 'default';
	var regex = new RegExp("^(" + prefix + ")\\-(.+)$");
	var resp = null;
	
	function do_success(method, resp) {
		clearTimeoout(timerId);
		
        if (_.isFunction(opts.success)) { opts.success(resp); }
        if (method === "read") { model.trigger("fetch"); }
	}
	
	function do_error(err) {
		if (_.isFunction(opts.error)) { opts.error(err); }
	}
	
	// must complete Sync method in 5 secs
	var timerId = setTimeout(function(opts) {
		do_error(opts, 'sc-properties timeout: ' + method);
	}, 5000);

	if (method === 'read') {
		if (opts.parse) {
			// is collection
			async.waterfall([
				keyobject.getKeys({'callback': function(keys) {
					callback(null, keys);
				}}),
				async.each(keys, function(prop, callback) {
					var list = [];
					var match = prop.match(regex);
					if (match !== null) {
						keyobject.getObject({'key':prop, 'callback': function(object) {
							list.push(object);
							callback(null);
						}});
					} else {
						callback(null);
					}
				}, callback(null, list)),
			], function(err, list) {
				if (err) {
					do_error(err);
				} else {
					do_success(method,list)
				}
			});
		} else {
			// is model
			keyobject.getObject({'key': prefix + '-' + model.id, 'callback': function(object) {
				model.set(object);
				do_success(method, model.toJSON());
			}});
		}
	}
	else if (method === 'create' || method === 'update') {
		if (!model.id) {
			model.id = guid();
			model.set(model.idAttribute, model.id);
		}
		
		keyobject.setObject({'key':prefix + '-' + model.id, 'object': (model.toJSON() || {}), 'callback': function() {
			do_success(method, model.toJSON());
		}});
	} else if (method === 'delete') {
		keyobject.removeObject({'key': prefix + '-' + model.id, 'callback': function() {
			model.clear();
			do_success(method, model.toJSON());
		}});
	}
}

module.exports.sync = Sync;
module.exports.beforeModelCreate = function(config) {
	// make sure we have a populated model object
	config = config || {};
	config.columns = config.columns || {};
	config.defaults = config.defaults || {};

	// give it a default id if it doesn't exist already
	if (typeof config.columns.id === 'undefined' || config.columns.id === null) {
		config.columns.id = 'String';
	}

	return config;
};
