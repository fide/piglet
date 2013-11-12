
if (OS_ANDROID) {
	MapModule = Alloy.Globals.Map;

	var rc = MapModule.isGooglePlayServicesAvailable()
	switch (rc) {
	    case MapModule.SUCCESS:
	        Ti.API.info('Google Play services is installed.');
	        break;
	    case MapModule.SERVICE_MISSING:
	        alert('Google Play services is missing. Please install Google Play services from the Google Play store.');
	        break;
	    case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
	        alert('Google Play services is out of date. Please update Google Play services.');
	        break;
	    case MapModule.SERVICE_DISABLED:
	        alert('Google Play services is disabled. Please enable Google Play services.');
	        break;
	    case MapModule.SERVICE_INVALID:
	        alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
	        break;
	    default:
	        alert('Unknown error checking for Google Play services.');
	        break;
	}
}

$.mapWindow.addEventListener('open', function() {
	// set up geolocation settings
	if (Ti.Geolocation.getLocationServicesEnabled() == true) {
		if (OS_IOS) {
			Ti.Geolocation.setPurpose('Show your current location.');
			Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_BEST);
		}
			
		if (OS_ANDROID) {
			Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_HIGH);
		}

	} else {
		alert ('Geolocation is not available');
		return;
	}
			
	// get lat/lon
	Ti.Geolocation.getCurrentPosition(function(e) {
		Ti.API.debug('results info:  ' + JSON.stringify(e));
			
		if (e.success) {
		    $.mapView.region = {
		    	latitude:e.coords.latitude,
		    	longitude:e.coords.longitude,
				latitudeDelta:0.1,
				longitudeDelta:0.1
			};
		} else {
			Ti.API.debug('Error getting location: ' + e.error);
			if (OS_ANDROID && ENV_DEV) alert('Make sure location is set in emulator');
			return;
		}
	});
});

function launchIndex() {
	var win = Alloy.createController('index').getView();
	
	if (win) {
		var arg = {};
		if (OS_ANDROID) {
			arg.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
			arg.activityExitAnimation = Ti.Android.R.anim.slide_out_right;			
		};
		win.open(arg);
		$.mapWindow.close();
	}
}

if (OS_IOS) {
	$.btnLogout.addEventListener('click', function(e) {
		acs.logoutUser(function() {
			launchIndex();
		});
	});
}

function launchDetail() {
	var args ={};
	args.parent = $.mapWindow;
	
	var win = Alloy.createController('detailview', args).getView();
	
	if (win) {
		var options = {};
		
		if (OS_ANDROID) {
			options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
			options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;			
		};
		
		win.open(options);
		//$.mapWindow.close();
	}
}

if (OS_IOS) {
	$.btnAdd.addEventListener('click', function(e) {
		launchDetail();
	});
}
