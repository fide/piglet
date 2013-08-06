function doClick(e) {
    alert(this.text);
}


// Event handler for orientation changes to re-orient primary container view
Ti.Gesture.addEventListener('orientationchange', function (ev) {
    if (Ti.Gesture.isLandscape(ev.orientation)) {
      // Update your UI for landscape orientation
    	$.primary.layout="horizontal";
    } else {
      // Update your UI for portrait orientation
    	$.primary.layout="vertical";
    }
  });

// Initialize layout based on orientation

if (Ti.Gesture.isPortrait() === true) {
	$.primary.layout="vertical";
} else {
	$.primary.layout="horizontal";
}

$.index.open();
