import $ from "jquery";

const aspectWidth = 16;
const aspectHeight = 9;

function resize() {
    // Get window width and height
    var w = $(window).width();
    var h = $(window).height();
    var stageWidth, stageHeight, stageTop, stageLeft;
    // If the window aspect ratio >=  screen aspect, fix height and set width based on height
    if ((w / h) >= aspectWidth / aspectHeight) {
        stageHeight = h;
        stageWidth = (aspectWidth / aspectHeight) * h;
        stageLeft = (w - stageWidth) / 2;
        stageTop = 0;


    }
    // If the window aspect ratio < than screen aspect, fix width and set height based on width
    else {
        stageWidth = w;
        stageHeight = (aspectHeight / aspectWidth) * w;
        stageTop = (h - stageHeight) / 2;
        stageLeft = 0;

    }


    //  var plungerRange = 10/stageHeight;
    // currentPlungerSpeed

    // Set "screen" object width and height to stageWidth and stageHeight, and center screen
    $(".screen").css({
        width: stageWidth + "px",
        height: stageHeight + "px",
        left: stageLeft + "px",

        top: stageTop + "px"
    });

    // Resize corner border radii based on stage height


    var cornerSize = .025 * stageHeight;
    $(".rounded").css({
        '-webkit-border-radius': cornerSize + "px",
        '-moz-border-radius': cornerSize + "px",
        'border-radius': cornerSize + "px"
    });

    // Resize text based on stage height

    // To give a class a certain font size, assign it the class "fs-X" where X is an integer between 1 and 1000. 1000 is the height of the screen.

    // New font resize loop
    for (var i = 1; i <= 1000; i++) {
        var s = stageHeight * (i / 1000);
        var c = ".fs-" + i;
        $(c).css({
            'font-size': s + "px"
        });
    }
}

$(window).resize(resize);
$(resize);
