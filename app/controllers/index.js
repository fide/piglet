function doClick(e) {
    alert(this.text);
}


// Event handler for orientation changes to re-orient primary container view
Ti.Gesture.addEventListener('orientationchange', function (ev) {
    if (Ti.Gesture.isLandscape(ev.orientation)) {
      // Update your UI for landscape orientation
    	$.primary.layout="horizontal";
    	$.loginContainer.height="100%";
    	$.loginContainer.width="50%";
    	$.signupContainer.height="100%";
    	$.signupContainer.width="50%";
    } else {
      // Update your UI for portrait orientation
    	$.primary.layout="vertical";
    	$.loginContainer.height="50%";
    	$.loginContainer.width="100%";
    	$.signupContainer.height="50%";
    	$.signupContainer.width="100%";
    }
  });

// Initialize layout based on orientation
if (Ti.Gesture.isPortrait() === true) {
	$.primary.layout="vertical";
	$.loginContainer.height="50%";
	$.loginContainer.width="100%";
	$.signupContainer.height="50%";
	$.signupContainer.width="100%";
} else {
	$.primary.layout="horizontal";
	$.loginContainer.height="100%";
	$.loginContainer.width="50%";
	$.signupContainer.height="100%";
	$.signupContainer.width="50%";
}

$.index.open();
