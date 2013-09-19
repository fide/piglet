var args = arguments[0] || {};

function launchMap() {
/*
	var win = Alloy.createController('mapview').getView();
	
	if (win) {
		var arg = {};
		if (OS_ANDROID) {
			arg.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
			arg.activityExitAnimation = Ti.Android.R.anim.slide_out_right;			
		};
		win.open(arg);
		$.detailWindow.close();
	}
*/
	args.parent.open();
	$.detailWindow.close();
}

if (OS_IOS) {
	$.btnBack.addEventListener('click', function(e) {
		launchMap();
	});
}