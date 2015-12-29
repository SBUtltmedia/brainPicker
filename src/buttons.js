import $ from "jquery";

export function showQuestionButtons(question) {

    var infoShown = false;

    $("#infoToggle").click(function() {
        if (infoShown == false) {
            infoShown = true;
            $("#info").toggle(infoShown);
            $("#info").draggable();
            useMousewheel(false);
        } else {
            infoShown = false;
            $("#info").toggle(infoShown);
            useMousewheel(true);
        }
        resizeWindow();
    });


    $("#infoClose").click(function() {
        infoShown = false;
        $("#info").toggle(infoShown);
        useMousewheel(true);
    });



    $("#restartToggle").click(function() {
        startJoyride();
    });

    for (var i = 0; i < question.length; i++) {

        var toolTip = question[i]["region"];
        var sBtn = ("qBtn" + i);
        $("#questionSelect").append("<button style='border:0' num=\"" + i + "\" id='qBtn" + i + "' class='questionSelectBtn'>" + (i + 1) + "</button>")
            //$( "button[num="+i+"]" ).append(i+1)
        $(".questionSelectBtn").addClass("fs-19");
        $("#" + sBtn).tooltip({
            items: "button",
            content: toolTip
        });

    }


    $(".questionSelectBtn").click(function(event) {

        /*
        var currentQuestionNum = parseInt($(event.target).attr('num'));
        resetQuestionState();
        cleanUpModal();
        updateButtons();
        */

    })

}
