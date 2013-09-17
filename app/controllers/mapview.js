var acs = require('acs');

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

$.btnLogout.addEventListener('click', function(e) {
	acs.logoutUser(function() {
		launchIndex();
	});
});

