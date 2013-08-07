function doClick(e) {
    alert(this.text);
}


// Event handler for orientation changes to re-orient primary container view
Ti.Gesture.addEventListener('orientationchange', function (ev) {
    if (Ti.Gesture.isLandscape(ev.orientation)) {
      // Update your UI for landscape orientation
    	$.primary.layout="horizontal";
    	$.login.height="100%";
    	$.login.width="50%";
    	$.signup.height="100%";
    	$.signup.width="50%";
    } else {
      // Update your UI for portrait orientation
    	$.primary.layout="vertical";
    	$.login.height="50%";
    	$.login.width="100%";
    	$.signup.height="50%";
    	$.signup.width="100%";
    }
  });

// Initialize layout based on orientation
if (Ti.Gesture.isPortrait() === true) {
	$.primary.layout="vertical";
	$.login.height="50%";
	$.login.width="100%";
	$.signup.height="50%";
	$.signup.width="100%";
} else {
	$.primary.layout="horizontal";
	$.login.height="100%";
	$.login.width="50%";
	$.signup.height="100%";
	$.signup.width="50%";
}

$.index.open();
