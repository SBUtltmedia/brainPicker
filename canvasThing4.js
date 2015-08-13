var which = 'Caudate';
var totalLayers = 34;
var requiredLayers; // Used to keep track, decrement count
var requiredPoints; // Used in drawGrid, and UpdatePoints
var globalPoly; // Used in UpdatePoints
var globalQuestion; // Yet to be used
var currentQuestionNum = 0; // Yet to be used
var totalReqPoints; //The number of Layers times the number of points
var currentRegion;
var layerTotal = 0;
var pointsLayer = 0;
var drawOp = 0;
var aspectWidth = 16;
var aspectHeight = 9;
var scaleFactor;
var imageWidth = 512;
var selectionMarker;
var sagitalTopOffsetPercent=50;
var sagitalAreaPercent=100;
var inter;
var previousScores;
var leaderBoard;
$(function() {
    
    $("#tourSelector").joyride({
        autoStart: true,
        postStepCallback: function(index, tip) {

        },
        
        modal: true,
        
        expose: true
    });

	
    
    $.getJSON("read.php", function(data) {
        previousScores = data;

}).fail(function() {
    console.log( "error - Previous scores" );
  })
  
      $.getJSON("highScores.json", function(data) {
        leaderBoard = data;
		}).fail(function() {
    	console.log( "error - Leaderboard" );
  	})
  
  
    $.getJSON("structures0.json", function(data) {
        globalPoly = data;


        $.getJSON("questionBank1.json", function(data) {
            globalQuestion = data;
            loadCurrentQuestion()
            showQuestionButtons()
            updateButtons();
            resizeWindow();
            // output
        }); // input
    }); // input
    // compute
});


function showQuestionButtons() {

for(i=0;i<globalQuestion.length;i++)
{


$("#questionSelect").append("<button style='border:0' num=\""+i+"\" id='qBtn"+i+"' class='questionSelectBtn'>"+ (i+1) +"</button>")
//$( "button[num="+i+"]" ).append(i+1)
$(".questionSelectBtn").addClass( "fs-19");

}


$(".questionSelectBtn").click(function(event) {

  currentQuestionNum= parseInt($(event.target).attr('num'));
 resetQuestionState();
 updateButtons();

})

}

function getUserHistory() {
var questionBool=[]
$.each(globalQuestion,function(key,value){
questionBool.push(!!previousScores[value["region"]])

})

return questionBool
//globalQuestion.each(function(){
 //previousScores
}

function updateButtons() {
   usrArr = getUserHistory();
	$(".questionSelectBtn").css("background-color","white");
	$(".questionSelectBtn").each(function(index){
	if (usrArr[index]) {
	
	$("[num="+index+"]").css("background-color", "green")
	}
	else {
	$("[num="+currentQuestionNum+"]").css("background-color", "yellow")
	
	}
	
	})
	
}

function highlightBtn(btnNum,btnColor) {

$("[num="+btnNum+"]").css("background-color", btnColor)

}
function resetQuestionState() {
 $('#modal').remove();
  $("#questionText").typed("reset");
 
}

function loadCurrentQuestion() {

  updateButtons();
  highlightBtn(currentQuestionNum,"yellow");
  
    $(".picked").remove();
    $(".joyride-content-wrapper").addClass( "fs-20");
     $("#questionText").addClass( "fs-23");
     resizeWindow();
     
    
    $("#gridTable").remove();
    drawOp = 0;
    totalReqPoints = globalQuestion[currentQuestionNum].pointsPerLayer * globalQuestion[currentQuestionNum].requestLayers;
    drawSlider(); // output


    var theQuestion = globalQuestion[currentQuestionNum];
    requiredPoints = theQuestion.pointsPerLayer;
    if (theQuestion.selectionMarker) 
    {selectionMarker = theQuestion.selectionMarker;} 
    else 
    {
    selectionMarker = null;
    delete obj;
    }
    var questionText = "Please pick " + theQuestion.pointsPerLayer + " points on " + theQuestion.requestLayers + " Layers in the <u>" + theQuestion.region + "</u><strong class='typed-cursor'> |</strong>";
    requiredLayers = theQuestion.requestLayers;
    which = theQuestion.region;
    currentRegion = "qn" + currentQuestionNum;
    upDatePoints()
    $("#helpText").html("<p class='powerOn'>You have " + totalReqPoints + " points left to place, across " + theQuestion.requestLayers + " more Layers </p>");
    $("#questionText").html("")

//if ( $("#questionText").   $("#questionText").removeData('typed');
    $("#questionText").typed({
        strings: ["Hello there<strong class='typed-cursor'> |</strong>", questionText],
        typeSpeed: 0,
        backDelay: 0,
        showCursor: false,
        contentType: 'html',
        resetCallback: function() { loadCurrentQuestion(); }
    });
  var activeR = leaderBoard[globalQuestion[currentQuestionNum]["region"]];  
  $("#leaderB").addClass( "fs-19");
  $("#leaderB").html(" ");
  $("#leaderB").append("<table><caption class='fs-21'>LeaderBoard</caption><tbody><tr><th>NetID</th><th>Score</th></tr><tr><td>" + activeR[0] + "</td><td>" + activeR[1] + "</td></tr></tbody></table>");
  
  
   
    
    
    //$("#questionText").html(questionText)

    drawGrid();
    if (selectionMarker) updateWidgets(selectionMarker["layers"][0])
    else updateWidgets(totalLayers);
}



function drawSlider() { // 1 Call by $(document).ready
    var select = $("#sliderDiv").slider({
        orientation: "vertical",

        min: 1,
        max: totalLayers,
        slide: function(event, ui) {
            updateWidgets(ui.value);
        }
    });
    $('.ui-slider-handle').css("height", "2.2%");
    $('.ui-slider-handle').css("width", "210%");
    $('.ui-slider-handle').css("margin-bottom", "-.125em");
    $('.ui-slider-vertical').css("height", "96.6%");
    $('.ui-slider-vertical').css("width", "10%");
    $('.ui-slider-vertical').removeClass('ui-corner-all')

    $('.ui-slider-handle').removeClass('ui-corner-all')
}

function updateSagital(layer)
{
sagitalAreaPercent=51.5;
sagitalTopOffsetPercent=15;
//var sagitalHeight=parseFloat($("#sagitalView").css("height"));
//var lineTop =((sagitalHeight*sagitalAreaPercent/100)/totalLayers)*(totalLayers-layer)+sagitalTopOffsetPercent; 
//console.log(lineTop,totalLayers,sagitalAreaPercent,layer,sagitalTopOffsetPercent);
lineTop=(totalLayers-layer)*(sagitalAreaPercent/totalLayers)+sagitalTopOffsetPercent;

$("#sagitaLine").css("top",lineTop+"%");




}


function updateWidgets(layer) {
    $("#sliderDiv").slider("value", layer);
  
    //$( "#sliderDiv" ).focus();
    upDatePoints(layer);
       updateSagital(layer);

}



function drawGrid() { // 2 Calls by addToClickList, $(document).ready
    var rows = totalLayers

    var tableMade = $('#gridTable').get(0);
    if (!tableMade) $('#gridList').append("<table id='gridTable'></table>")


    for (n = rows; n > 0; n--) {
        var currentRowId = 'row_' + n;
        if (!tableMade) {
            $('#gridTable').append("<tr id='" + currentRowId + "'></tr>");
            $('#' + currentRowId).click(function() {
                var thisRowNum = this.id.split("_")[1];

                updateWidgets(thisRowNum);

            })
        }


        for (m = 0; m < requiredPoints; m++) {

            currentGrid = $('#gridTable #box_' + n + "_" + m)
            var boxPercent = 100 / (requiredPoints + 1);
            if (!tableMade) {
                $('#' + currentRowId).append("<td id='box_" + n + "_" + m + "' style='width:" + boxPercent + "%' class='gridBox'></td>");
                if (m == requiredPoints - 1) {
                    $('#' + currentRowId).append("<td id='erase_" + n + "' class='strobeBtn' style='visibility: hidden;'></td>");
                    $("#" + "erase_" + n).click(function() {
                        $("." + this.id.split("_")[1]).remove();
                        drawGrid();

                    })
                }

            } else if (m < $("." + n + '.' + currentRegion).length) {

                currentGrid.css({
                    "background-color": "yellow"

                })
            } else {
                currentGrid.css({
                    "background-color": "white"
                });


            }
        }

        if ($('.' + n).length > 0) {
            //console.log($('.'.n).length);
            $("#" + "erase_" + n).css({
                "visibility": "visible"
            })

        } else {
            $("#" + "erase_" + n).css({
                "visibility": "hidden"
            })
        }


    }

}

function upDatePoints(layer) { // 2 Call by DrawSlider, Index.html
   
    for (var i = 1; i <= totalLayers; i++) {
        $('.' + i).hide();
        if (i == layer) {
            $('.' + currentRegion + '.' + i).show();

            changePic(layer)
            drawMultiPoly()
        }
    }
}

function changePic(i) {
    $('#brainPic')[0].src = "images/" + i + ".png";
}

function drawMultiPoly() {
    layerIndex = $("#sliderDiv").slider("value");
    $('canvas').removeLayerGroup("group" + layerIndex);


    var curRegion = globalPoly[which];
    var curSlice = curRegion[layerIndex];
    //canvasClearing();



    if (curSlice) $.each(curSlice, function(i, el) {

        drawPoly(layerIndex, i, curSlice[i]);
        
        if (selectionMarker &&   layerIndex >= selectionMarker.layers[0] && layerIndex <= selectionMarker.layers[1]) {

        $('canvas').drawArc({
            fillStyle: '#0F0',
            x: selectionMarker.location[0] / scaleFactor,
            y: selectionMarker.location[1] / scaleFactor,
            radius: 8 / scaleFactor,
            layer: true,
            name: "MC indicator",
            groups: ["group" + layerIndex]
        });
    }
    
        
        
        
        
    });


    for (var i = 1; i <= totalLayers; i++) {
        if (i == layerIndex) var isVisible = false;
        else var isVisible = true;
        theGroup = $('canvas').getLayerGroup("group" + i)
        if (theGroup != undefined) {
            if (i == layerIndex) {

                $('canvas').setLayerGroup("group" + i, {
                    visible: true
                }).drawLayers();

            } else $('canvas').setLayerGroup("group" + i, {
                visible: false
            }).drawLayers();
        }
    }
}

function drawPoly(layerIndex, polyIndex, curPoly) {
drawOp=.5
    var obj = {
        strokeWidth: 3,
        rounded: true,
        layer: true,
        name: "layer" + layerIndex + "_" + polyIndex,
        closed: true,
        opacity: drawOp,
        // opacity: true,
        groups: ["group" + layerIndex],
        fillStyle: 'orange',
        click: function(e) {
            console.log("Hit");
            addToClickList(e._eventX, e._eventY, true);
            
        }
    };
    for (var p = 0; p < curPoly.length; p += 2) {
        obj['x' + (p / 2 + 1)] = curPoly[p] / scaleFactor;
        obj['y' + (p / 2 + 1)] = curPoly[p + 1] / scaleFactor;
    }
   $('canvas').drawLine(obj);
    
};




function addToClickList(ex, ey, isCorrect) { // 2 calls from canvasClearing, drawPoly
    var fudgeX = 2.8;
    var fudgeY = 4.2;
    var percentX = ex / stageWidth * 100 + fudgeX;
    var percentY = ey / stageHeight * 100 + fudgeY;
    //alert(ey);
    var currentLayer = $("#sliderDiv").slider("value");
    var currentElement = $('.' + currentLayer)
        //console.log(activeLayers());
    if ((activeLayers()) >= requiredLayers && currentElement.length == 0) {
        focusLayerErase();
        toggleStatic(true);
        $("#helpText").html("<h3>You've exceded the number of layers, please delete your points off one layer</h3>");
        return null;
    }

    if (currentElement.length >= requiredPoints) {
        //console.log(currentElement.length)
        currentElement[currentElement.length - 1].remove();

    }
    var availableSpace = 0;
    for (i = 0; i < requiredPoints; i++) {
        if ($("#point_" + currentLayer + "_" + i).length == 0) {
            console.log(i);
            availableSpace = i;
            break;
        }
    }



    //clickList.push({"regionName":which,"left":ex, "top":ey,"layerNum":currentLayer,"isCorrect":isCorrect} )
    var idName = "point_" + currentLayer + "_" + availableSpace

    pointsLayer = currentElement.length;
    console.log(isCorrect);
    $("#brainDisplay").append("<div onclick='$(this).remove();drawGrid();checkPointCount(currentRegion);' isCorrect='" + isCorrect + "' class='" + currentLayer + " " + currentRegion + " pointerImage picked' style='position:absolute; left:" + percentX + "%; top: " + percentY + "%;' id='" + idName + "'><img src='images/BrainPointer.svg'/></div>");


    /*
	   $("#" + idName).css({
	   "left": ex + "px",
	   "top": ey + "px"
	   });
	   */
    drawGrid();

    checkPointCount(currentRegion);
    layerTotal = activeLayers();
}



function activeLayers() {
    var totalRows = 0;

    var rows = totalLayers;
    for (i = 0; i <= rows; i++) {
        //console.log($("." + i));
        if ($("." + i).length > 0) totalRows++;

    }
    //console.log(totalRows);
    return totalRows;
}



function checkPointCount(region) {
    toggleStatic(false);
    var cs = $("." + region);
    var t = cs.length;
    //console.log(t);
    var pointsLeft = totalReqPoints - t
    var pointPerLayer = requiredPoints - pointsLayer;

    $("#helpText").html("You have " + pointsLeft + " points left to place, across " + (requiredLayers - activeLayers()) + " more Layers");
    if (pointPerLayer <= 3 && pointPerLayer > 1) $("#helpText").append("<p>You need " + (pointPerLayer - 1) + " points on this Layer.</p>");
    else $("#helpText").append("<p>You have enough points here.</p>");

    if (!(pointsLeft >= 0 && t < totalReqPoints)) {
        $("#helpText").html("You've placed all the points! Click here when you are ready to check your answers:");
        $("#helpText").append("<button id='y' >Submit</button>");
        $('#y').click(function() {
            //colorPoints();
            drawOp = 100;
            playbackTheatre(currentRegion);

        })
    }
}


function colorPoints(playbackLayer) {

    //console.log(currentRegion,num);
    var points = $("." + playbackLayer + ".picked");

    var currentPoint = points[0]
        //console.log($(currentPoint));
    $(currentPoint).removeClass("picked");
    $(currentPoint).addClass("checked");
    var id = $(currentPoint).attr("id").replace("point", "box")


    //console.log( $(this).attr("id"))
    if ($(currentPoint).attr("isCorrect") == "true") {
        $(currentPoint).children().attr("src", "images/BrainPointer_Correct.svg")
        $("#" + id).css("background-color", "green");
        return 1;
    }

    $(currentPoint).children().attr("src", "images/BrainPointer_Incorrect.svg")
    $("#" + id).css("background-color", "red");
    return 0;
}



function focusLayerErase() {

	
    
    
    $(".strobeBtn").css("background-image", "url('images/btn_bck.gif')");
    $('.strobeBtn').click(function() {
        $(".strobeBtn").css("background-color", "");
        $(".strobeBtn").css("background-image", "url('images/eraseLayer.svg')");
        checkPointCount(currentRegion);
    })
   

}

function toggleStatic(b) {

    if (b == true) $("#helpText").css("background-image", "url('images/Static2.gif')");
    else $("#helpText").css("background-image", "");

}

function playbackTheatre(theRegion) {
    var cs = $("." + theRegion);
    $("#helpText").empty();
    $("#helpText").html("<h1>Evaluating: <------- </h1>");
    var playbackLayer = totalLayers;
    var progressbar = $("#progressbar")
    progressbar.progressbar({
        value: false,
        max: totalReqPoints,
        change: function() {

        },
        complete: function() {

        }
    });


    inter = setInterval(function() {


        //console.log(($(".picked").length + " " + playbackLayer))

        if ($(".picked").length == 0 && playbackLayer == 0) {
            //endModal(cs);
            $("#helpText").html("<h1>DONE</h1>");
            clearInterval(inter)
            $(".checked").addClass("picked");
            $(".checked").removeClass("checked");

        }
        var afterBurnerCount;

        //console.log("Help!");

        updateWidgets(playbackLayer);
        if ($("." + playbackLayer + ".picked").length == 0) {



            //afterBurner(playbackLayer);

            playbackLayer--;
        } else {

            retValue = colorPoints(playbackLayer);

            bumpBar(retValue);




        }

        if (playbackLayer == 0) endModal(cs);

    }, 200)




}


function bumpBar(c) {
    var progressbar = $("#progressbar");
    var val = progressbar.progressbar("value") || 0;
    progressbar.progressbar("value", val + c);


}

function afterBurner(layer) {
    var pointArray = $("#" + layer + " pointerImage")

    for (i = 0; i < pointArray.length; i++) {
        for (j = 0; j < (pointArray.length - i); j++) {
            //console.log(pointArray[j]);
        }
    }

    //console.log($(this));
}

function rePlay() {
    $('#modal').remove();

    console.log("Pressed");
    loadCurrentQuestion();

}

function score() {
    $('#modal').remove();
    playbackTheatre(currentRegion);




}

function stripUnderscores() {
//var spacedRegion = currentRegion("_"g, / /);
//console.log(spacedRegion);
}

function endModal(cs) {
    var t = cs.length;
    var g = cs.filter(function(x, el) {
        return $(el).attr("iscorrect") == "true"
    }).length;
    var b = cs.filter(function(x, el) {
        return $(el).attr("iscorrect") == "false"
    }).length;


    barTotal = g * (100 / totalReqPoints);
	stripUnderscores();
    $("#brainDisplay").append("<div id='modal'><div><h1>Your score is: </h1><h2>" + g + "</h2><button id='n' onclick='nextQuestion();'>Next Question</button><button id='rp' onclick='score()'>Replay Answer</button><button id='ta' onclick='rePlay()'>Try Again</button>  </div></div>");
    $("#modal").addClass( "fs-35");
    $("#modal button").addClass( "fs-22");
    resizeWindow();
    $.ajax({
                type: "POST",
                url: "save.php",
                data: globalQuestion[currentQuestionNum]["region"]  + '=' + g
            });
    
    
    
}
nextQuestion = function() {
    cleanUpModal();
    currentQuestionNum++;
      resetQuestionState();
      updateButtons();
     
    
    





}

function cleanUpModal() {

    $('#modal').remove();
    $('#progressbarDiv').progressbar("destroy");

}


function distance(point1, point2) {
    a = Math.abs(parseFloat($("#" + point1).css("left")) - parseFloat($("#" + point2).css("left")));
    b = Math.abs(parseFloat($("#" + point1).css("top")) - parseFloat($("#" + point2).css("top")));
    var canvasWidth = parseFloat($("#brainDisplay").css("width"));
    var ceiling = Math.sqrt(((canvasWidth) ^ 2) * 2);
    var rawDistance = Math.sqrt((a ^ 2 + b ^ 2));
    //console.log(ceiling);

}

function checkWin(cs) {
    console.log("A Winner is you!");
    //var cs = $("." + region);
    var t = cs.length;
    var g = cs.filter(function(x, el) {
        return $(el).attr("iscorrect") == "true"
    }).length;
    var b = cs.filter(function(x, el) {
        return $(el).attr("iscorrect") == "false"
    }).length;
    //alert('total='+t+', good='+g+', bad='+b + ', clickList='+JSON.stringify(clickList));
    //if (t < 5) return;
    //if (g < 5) return;
    //if (b > 0) return;
    $('#helpText').html('You Win');
    $("#modal h1").html('You Win!');


}

// Fix aspect ratio of the stage
$(window).resize(function() {
    resizeWindow();
    drawMultiPoly();
});

// Resize the window
function resizeWindow() {
    // Get window width and height

    var w = $(window).width();
    var h = $(window).height();
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
    var canvasWidth = parseFloat($("#brainDisplay").css("width"))
    $("#theCanvas").attr("width", canvasWidth);
    $("#theCanvas").attr("height", parseFloat($("#brainDisplay").css("height")));
    console.log(canvasWidth)
    obj = {
        name: "wrongLayer",
        layer: true,
        width: canvasWidth * 2,
        height: canvasWidth * 2,
        click: function(e) {
            addToClickList(e._eventX, e._eventY, false);
        }
    }
    $('canvas').removeLayer("wrongLayer");
    $('canvas').drawRect(obj);
    scaleFactor = imageWidth / canvasWidth;
    // Resize corner border radii based on stage height

    console.log(scaleFactor)
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
    // layer = $("#sliderDiv").slider("value");
    //drawMultiPoly(layer);


}