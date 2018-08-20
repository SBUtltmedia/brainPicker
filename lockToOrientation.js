
goFullScreen = null;
exitFullScreen = null;
orientKey = null;
function getOrientationKeys() {
  orientKey = 'orientation';
  if ('mozOrientation' in screen) {
    orientKey = 'mozOrientation';
  } else if ('msOrientation' in screen) {
    orientKey = 'msOrientation';
  }

  // browsers require full screen mode in order to obtain the orientation lock
  if ('requestFullscreen' in document.documentElement) {
    goFullScreen = 'requestFullscreen';
    exitFullScreen = 'exitFullscreen';
  } else if ('mozRequestFullScreen' in document.documentElement) {
    goFullScreen = 'mozRequestFullScreen';
    exitFullScreen = 'mozCancelFullScreen';
  } else if ('webkitRequestFullscreen' in document.documentElement) {
    goFullScreen = 'webkitRequestFullscreen';
    exitFullScreen = 'webkitExitFullscreen';
  } else if ('msRequestFullscreen') {
    goFullScreen = 'msRequestFullscreen';
    exitFullScreen = 'msExitFullscreen';
  }
}
function mobileSetup() {
  $("#preloader").html($("<h4/>", {
    "style": "font-Size : 10rem",
    "text": "Tap to Start"
  }));
  $("#status").css("backgroundImage", "none");
  $("#preloader").on("click", function() {
      document.documentElement[orientationKeys["goFullScreen"]] && document.documentElement[orientationKeys["goFullScreen"]]();
      changeOrientation("landscape", orientationKeys["orientKey"], orientationKeys["exitFullScreen"]);
      mobilePotraitBlocker(false);
    });
    //allows for tapping to rotate
    $("#preloader").off();
    $("#preloader").on("click", function() {
        document.documentElement[goFullScreen] && document.documentElement[goFullScreen]();
        changeOrientation("landscape");
        mobilePotraitBlocker(false);
      });
      $("body").on("click", function() {
          document.documentElement[goFullScreen] && document.documentElement[goFullScreen]();
          mobilePotraitBlocker(false);
        });

}
//For setup on mobile phones

function mobilePotraitBlocker(status) {
  if (status) {
    $('#preloader').delay(100).fadeIn('slow'); // will fade out the white DIV that covers the website.
  }
  else {
    setTimeout(function(){
        resizeWindow();
    },100);

  }
}

function changeOrientation(orientationType) {
  var promise = null;
  if (screen[orientKey].lock) {
    promise = screen[orientKey].lock(orientationType);
  } else {
    promise = screen.orientationLock(orientationType);
  }

  promise.then(function() {
  }).catch(function(err) {

  });
}
