import $ from "jquery";
require('jquery-ui');

$(function() {
    $("#accordion").accordion({
        heightStyle: "fill"
    });
});

$(window).resize(() => {
    // Get window width and height
    $("#accordion").accordion("refresh");
});
