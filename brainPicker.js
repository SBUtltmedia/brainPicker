var state = {};

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
var sagitalTopOffsetPercent = 50;
var sagitalAreaPercent = 100;
var inter;
var previousScores;
var leaderBoard;
var previousX;
var previousY;
var canvasWidthGlobal;
var currentLayer;
const sensitivity = 120;
const timeOutTime = 70;
var pause = undefined;
var mouseOverGridEnabled = false;
var myTimeOut;
$(function() {


  $("#accordion").accordion({
    heightStyle: "fill"
  });

  useMousewheel(true);

  $.getJSON("read.php", function(data) {
    previousScores = data;

    if (Object.keys(previousScores).length == 0) {
      startJoyride();
    }

  }).fail(function() {
    console.log("error - Previous scores");
  })

  $.getJSON("highScores.json", function(data) {
    leaderBoard = data;
  }).fail(function() {
    console.log("error - Leaderboard");
  })


  $.getJSON("structuressep9.json", function(data) {
    globalPoly = data;


    $.getJSON("questionBank1.json", function(data) {
      globalQuestion = data;
      loadCurrentQuestion()
      showQuestionButtons()
      updateButtons();
      loadPlayerButtons();
      gridBuffer();
      computeBounds(globalPoly[which]);
      resizeWindow();




      // output
    }); // input
  }); // input
  // compute
});



function startJoyride() {
  var nextShowing;
  var prevShowing;
  var pauseShowing;
  $("#tourSelector").joyride({
    autoStart: true,
    postRideCallback: function() {
      //Fills back in the previous visibility before tutorial was called
      if (pause) {
        pauseShowing = "visible"
        prevShowing = "visible"
        nextShowing = "visible"
      }
      $("#playbackControls").css("visibility", pauseShowing);
      $("#buttonPrevPlayer").css("visibility", prevShowing);
      $("#buttonNextPlayer").css("visibility", nextShowing);
    },
    preRideCallback: function() {
      //Pulls previous visibility before tutorial was called
      pauseShowing = $("#playbackControls").css("visibility");
      prevShowing = $("#buttonPrevPlayer").css("visibility");
      nextShowing = $("#buttonNextPlayer").css("visibility");
      $("#playbackControls").css("visibility", "visible");
      $("#buttonPrevPlayer").css("visibility", "visible");
      $("#buttonNextPlayer").css("visibility", "visible");
    },

    modal: true,

    expose: true
  });

}



//Use key presses to change layer
// window.onkeyup = function(e) {
//   var key = e.keyCode ? e.keyCode : e.which;
//   if (key == 38) {
//     updateWidgets(currentLayer + 1);
//   } else if (key == 87) {
//     updateWidgets(currentLayer + 1);
//   } else if (key == 40) {
//     updateWidgets(currentLayer - 1);
//   } else if (key == 83) {
//     updateWidgets(currentLayer - 1);
//   }
// }

// function unbindForPlayback(isOn) {
//   //if pause exists, be sure to always unbind (useful for infoToggle and restartToggle)
//   if (pause)
//       isOn = true;
//   if (isOn == true) {
//     useMousewheel(false);
//     console.log("binding off");
//     $("#brainDisplay").unbind()
//     for (n = totalLayers; n > 0; n--) {
//       var currentRowId = 'row_' + n;
//       $('#' + currentRowId).off("click mouseover");
//     }
//     $(".questionSelectBtn").off();
//
//   } else {
//     useMousewheel(true);
//     $("#restartToggle").off('click',function() {
//       if (pause == false){
//         pausePlayback();
//       }
//     });
//     $(".questionSelectBtn").on("click", function(event) {
//
//       currentQuestionNum = parseInt($(event.target).data('num'));
//       resetQuestionState();
//       cleanUpModal();
//       updateButtons();
//
//     })
//
//   }
//
//
// }
function unbindAll(status) {
  //since opposite, !status
  useMousewheel(!status);
  if (status) {
    $("body").css("pointerEvents", "none")
  } else {
    $("body").css("pointerEvents", "auto")
  }

}

function useMousewheel(status) {
  if (status == true) {
    $('#stage').on('mousewheel DOMMouseScroll', function(e) {

      var o = e.originalEvent;
      var delta = o && (o.wheelDelta || (o.detail && -o.detail));
      if (delta) {
        e.preventDefault();

        var step = Math.round(Math.abs(delta / sensitivity));
        step *= delta < 0 ? 1 : -1;

        var newVal = currentLayer - step;

        if ((newVal >= 1) && (newVal <= totalLayers)) {
          //console.log(newVal);
          updateWidgets(newVal);
        }
      }
    });
  } else {
    $('#stage').off("mousewheel DOMMouseScroll");
    console.log("unbinding mouse wheel");
  }
}

function showQuestionButtons() {



  $("#infoToggle,#infoClose").on("click", function() {
    var isVisible = $("#info").toggle().is(':visible')
    unbindAll(isVisible);
    $("#info").css("pointerEvents", "auto");
    resizeWindow();
  });






  $("#restartToggle").click(function() {
    $("#tourSelector").css("pointerEvents", "auto");
    startJoyride();
  });

  for (i = 0; i < globalQuestion.length; i++) {

    toolTip = globalQuestion[i]["region"];

    var qBtn = $("<button/>", {
      style: 'border:0',
      "data-num": i,
      id: 'qBtn' + i,
      class: 'questionSelectBtn',
      text: i + 1
    }).tooltip({
      items: "button",
      content: toolTip
    });
    $("#questionSelect").append(qBtn)
    //$( "button[num="+i+"]" ).append(i+1)
    $(".questionSelectBtn").css("font-size", "1rem");


  }


  $(".questionSelectBtn").on("click", function(event) {

    currentQuestionNum = parseInt($(event.target).data('num'));
    resetQuestionState();
    cleanUpModal();
    updateButtons();

  })

}


function computeBounds(pointList) {


  var boxSize = [0, 0, 0];
  var maxCoords = [0, 0, 0];
  var minCoords = [1, 1, 1];
  $.each(pointList, function(index, value) {
    console.log(index);
    for (i = 0; i < value[0].length; i += 2) {
      var normX = value[0][i] / imageWidth;
      var normY = value[0][i + 1] / imageWidth;
      var normZ = index / totalLayers;

      //console.log(normX, normY, normZ);

      if (normX > maxCoords[0]) maxCoords[0] = normX;
      if (normY > maxCoords[1]) maxCoords[1] = normY;
      if (normZ > maxCoords[2]) maxCoords[2] = normZ;

      if (normX < minCoords[0]) minCoords[0] = normX;
      if (normY < minCoords[1]) minCoords[1] = normY;
      if (normZ < minCoords[2]) minCoords[2] = normZ;

      //console.log(maxCoords[0], maxCoords[1], maxCoords[2], minCoords[0], minCoords[1], minCoords[2]);

      for (ee = 0; ee < 3; ee++) {
        boxSize[ee] = maxCoords[ee] - minCoords[ee];
      }



    }

  });


}


function getUserHistory() {
  var questionBool = []
  $.each(globalQuestion, function(key, value) {
    questionBool.push(!!previousScores[value["region"]])

  })

  return questionBool
  //globalQuestion.each(function(){
  //previousScores
}

function updateButtons() {

  usrArr = getUserHistory();
  console.log(usrArr);
  $(".questionSelectBtn").css("background-color", "white");
  $(".questionSelectBtn").each(function(index, element) {


    if (index == currentQuestionNum) {
      $(this).css("background-color", "yellow")
    } else {
      if (usrArr[index]) {

        $(this).css("background-color", "green")
      } else {
        $(this).css("background-color", "white")

      }
    }
  })

}


function resetQuestionState() {
  $('#modal').remove();
  $("#questionText").typed("reset");
  $("#buttonPausePlayer").innerHTML = "&#10074&#10074";

}

function loadCurrentQuestion() {

  updateButtons();


  $(".picked").remove();
  $(".joyride-content-wrapper").css("font-size", "1.2rem");
  $("#questionText").css("font-size", "1.2rem");
  resizeWindow();


  $("#gridTable").remove();
  //MasterOpacity
  drawOp = 0;
  totalReqPoints = globalQuestion[currentQuestionNum].pointsPerLayer * globalQuestion[currentQuestionNum].requestLayers;
  //drawSlider(); // output


  var theQuestion = globalQuestion[currentQuestionNum];
  requiredPoints = theQuestion.pointsPerLayer;
  if (theQuestion.selectionMarker) {
    selectionMarker = theQuestion.selectionMarker;
  } else {
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
    strings: [questionText],
    typeSpeed: 0,
    backDelay: 0,
    showCursor: false,
    contentType: 'html',
    resetCallback: function() {
      loadCurrentQuestion();
    }
  });


  drawGrid();
  var activeR = leaderBoard[globalQuestion[currentQuestionNum]["region"]];
  $("#leaderB").css("font-size", "1rem");
  $("#leaderB").html(" ");
  if (activeR) $("#leaderB").append("<table><caption font-size='1.1rem'>LeaderBoard</caption><tbody><tr><th>NetID</th><th>Score</th></tr><tr><td>" + activeR[0] + "</td><td>" + activeR[1] + "</td></tr></tbody></table>");




  //$("#questionText").html(questionText)

  //console.log(selectionMarker);
  if (selectionMarker) updateWidgets(selectionMarker["layers"][0])
  else updateWidgets(totalLayers);
}


//Old for slider
// function drawSlider() { // 1 Call by $(document).ready
//   var select = $("#sliderDiv").slider({
//     orientation: "vertical",
//
//     min: 1,
//     max: totalLayers,
//     slide: function(event, ui) {
//       updateWidgets(ui.value);
//     }
//   });
//   $('.ui-slider-handle').css("height", "3.8%");
//   $('.ui-slider-handle').css("width", "285%");
//   //$('.ui-slider-handle').css("margin-bottom", "-.125em");
//   $('.ui-slider-vertical').css("height", "100%");
//   $('.ui-slider-vertical').css("width", "10%");
//   $('.ui-slider-vertical').removeClass('ui-corner-all')
//
//   $('.ui-slider-handle').removeClass('ui-corner-all')
//
//
//
//
// }




function updateSagital(layer) {
  sagitalAreaPercent = 51.5;
  sagitalTopOffsetPercent = 15;
  //var sagitalHeight=parseFloat($("#sagitalView").css("height"));
  //var lineTop =((sagitalHeight*sagitalAreaPercent/100)/totalLayers)*(totalLayers-layer)+sagitalTopOffsetPercent;
  //console.log(lineTop,totalLayers,sagitalAreaPercent,layer,sagitalTopOffsetPercent);
  lineTop = (totalLayers - layer) * (sagitalAreaPercent / totalLayers) + sagitalTopOffsetPercent;

  $("#sagitaLine").css("top", lineTop + "%");




}


function updateWidgets(layer) {
  if (layer > totalLayers || layer <= 0) return;
  //console.log(layer);
  currentLayer = layer;
  $(".pointerCell").css("opacity", 0);
  $("#pointerCellrow_" + layer).css("opacity", 1);
  //$("#sliderDiv").slider("value", layer);

  //$( "#sliderDiv" ).focus();
  upDatePoints(layer);
  updateSagital(layer);


}
//The following function creates a buffer for the grid, allowing the user to go over for half a second without chaning layers
function gridBuffer() {
  // var isOver;
  // $("#gridList").on("mouseenter", function() {
  //   isOver = true;
  //   setTimeout(function() {
  //     if (isOver) {
  //       mouseOverGridEnabled = true;
  //
  //     //  console.log("gridEnabled");
  //     }
  //   }, 500);
  // });
  // $("#gridList").on("mouseleave", function() {
  //   isOver = false;
  //   mouseOverGridEnabled = false;
  // });

}

function drawGrid() { // 2 Calls by addToClickList, $(document).ready
  var rows = totalLayers;
  var myTimeOut;
  var delay = 0;
  var tableMade = $('#gridTable').get(0);
  if (!tableMade) $('#gridList').append("<table id='gridTable'></table>");

  $("#gridList").on("mouseenter mouseleave", function() {
    useMousewheel(true);
    clearTimeout(myTimeOut)
    //console.log("gridList")
    delay = 500;

  });
  for (n = rows; n > 0; n--) {

    if (!tableMade) {
      var currentRowId = 'row_' + n;
      var tableRow = $("<tr/>", {
        "class": "gridRow",
        "id": currentRowId
      })
      $('#gridTable').append(tableRow);
    }

    var boxPercent = 100 / (requiredPoints + 2);
    var pointerCell = $("<td/>", {
      id: "pointerCell" + currentRowId,
      style: "width:" + boxPercent + "%",
      class: "pointerCell"
    });
    if ($("#pointerCell" + currentRowId).length == 0) {
      $('#' + currentRowId).append(pointerCell);
    }






    for (m = 0; m < requiredPoints; m++) {

      currentGrid = $('#gridTable #box_' + n + "_" + m)

      if (!tableMade) {
        $('#' + currentRowId).append("<td id='box_" + n + "_" + m + "' style='width:" + boxPercent + "%' class='gridBox'></td>");
        if (m == requiredPoints - 1) {
          $('#' + currentRowId).append("<td id='erase_" + n + "' class='strobeBtn' style='visibility: hidden;'></td>");
          $("#" + "erase_" + n).click(function() {
            $("." + this.id.split("_")[1]).remove();
            drawGrid();
            checkPointCount(currentRegion);
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
  $('.gridRow').on("click mouseenter", function(evt) {
    useMousewheel(false);
    //console.log("gridRow")
    myTimeOut = setTimeout(function() {
      var thisRowNum = evt.currentTarget.id.split("_")[1];
      updateWidgets(thisRowNum);
      delay = 0;
    }, delay);
  });
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

function drawWrongClicks() {

  var canvasWidth = parseFloat($("#brainDisplay").css("width"))
  $("#theCanvas").attr("width", canvasWidth);
  $("#theCanvas").attr("height", parseFloat($("#brainDisplay").css("height")));

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

}




function drawMultiPoly() {



  drawWrongClicks()
  layerIndex = currentLayer
  $('canvas').removeLayerGroup("group" + layerIndex);


  var curRegion = globalPoly[which];
  var curSlice = curRegion[layerIndex];
  //canvasClearing();



  if (curSlice) $.each(curSlice, function(i, el) {

    drawPoly(layerIndex, i, curSlice[i]);

    if (selectionMarker && layerIndex >= selectionMarker.layers[0] && layerIndex <= selectionMarker.layers[1]) {

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


      $('canvas').setLayerGroup("group" + i, {
        visible: i == layerIndex
      }).drawLayers();

    }
  }


}

function drawPoly(layerIndex, polyIndex, curPoly) {

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
  var fudgeX = 2.65;
  var fudgeY = 4.35;
  var percentX = ex / stageWidth * 100 + fudgeX;
  var percentY = ey / stageHeight * 100 + fudgeY;
  //alert(ey);
  //var currentLayer = $("#sliderDiv").slider("value");
  var currentElement = $('.' + currentLayer)
  //console.log(activeLayers());
  if ((activeLayers()) >= requiredLayers && currentElement.length == 0) {
    //No warning?
    // focusLayerErase();
    // toggleStatic(true);
    // $("#helpText").html("<h3>You've exceded the number of layers, please delete your points off one layer</h3>");
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
  //Makes sure you can't like, click on the same point a bunch of times in a row, which was a thing that happened.
  if ((percentX != previousX) && (percentY != previousY)) {
    var idName = "point_" + currentLayer + "_" + availableSpace
    pointsLayer = currentElement.length;

    $("#brainDisplay").append("<div onclick='$(this).remove();drawGrid();checkPointCount(currentRegion);' isCorrect='" + isCorrect + "' class='" + currentLayer + " " + currentRegion + " pointerImage picked' style='position:absolute; left:" + percentX + "%; top: " + percentY + "%;' id='" + idName + "'><img src='images/BrainPointerSmall.svg'/></div>");
    previousX = percentX;
    previousY = percentY;
  }

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
    var submitButton = $("<button/>", {
      id: "submit",
      text: "Submit Answers"
    });
    submitButton.css({
      "fontSize": "1rem",
      "margin-top": ".5rem"
    });
    $("#helpText").append(submitButton);
    $('#submit').click(function() {
      //colorPoints();
      drawOp = 0.5;
      currentLayer = totalLayers;
      playbackTheatre(currentRegion);

    })
  }
}

function loadPlayerButtons() {
  var buttonBank = $("<div/>", {
    id: "buttonBank",
    style: "z-index:10"
  })
  var buttonPausePlayer = $("<button/>", {
    id: "buttonPausePlayer"
  });
  var buttonPrevPlayer = $("<button/>", {
    id: "buttonPrevPlayer"
  });
  var buttonNextPlayer = $("<button/>", {
    id: "buttonNextPlayer"
  });
  buttonPausePlayer.html("&#10074&#10074");
  buttonPrevPlayer.html("&larr;");
  buttonNextPlayer.html("&rarr;");

  buttonBank.append(buttonPrevPlayer);
  buttonBank.append(buttonPausePlayer);
  buttonBank.append(buttonNextPlayer);
  buttonBank.visibility = "hidden";
  $("#playbackControls").prepend(buttonBank);
  $("#playbackControls").css("visibility", "hidden");
  $("#buttonPrevPlayer").css("visibility", "hidden");
  $("#buttonNextPlayer").css("visibility", "hidden");



}




function focusLayerErase() {


  $(".strobeBtn").css("background-image", "url('images/btn_bck.gif')");
  $('.strobeBtn').click(function() {
    checkPointCount(currentRegion);
    $(".strobeBtn").css("background-color", "");
    $(".strobeBtn").css("background-image", "url('images/eraseLayer.svg')");
  })


}

function toggleStatic(b) {

  if (b == true) $("#helpText").css("background-image", "url('images/Static2.gif')");
  else $("#helpText").css("background-image", "");

}



function playbackTheatre(theRegion) {
  unbindAll(true);
  $("#playbackControls").css("pointerEvents", "auto");
  $(".questionSelectBtn").css("backgroundColor", "#a6a9ad");
  $("#infoToggle").css("pointerEvents", "auto");
  $("#restartToggle").css("pointerEvents", "auto");
  if (pause == undefined) {
    $("#buttonPausePlayer").on("click", function() {
      pausePlayback();
    });
    $("#buttonNextPlayer").on("click", function() {
      playResults();
    });
    $("#buttonPrevPlayer").on("click", function() {
      updateWidgets(currentLayer + 1);
    });
  }
  $("#playbackControls").css("visibility", "visible");
  document.getElementById("buttonPausePlayer").innerHTML = "&#10074&#10074";
  console.log("Loading playback theatre")
  var totalAfterBurnerScore = 0;
  pause = false;
  $("#restartToggle").on('click', function() {
    if (pause == false) {
      pausePlayback();
    }
  });
  $("#infoToggle").on('click', function() {
    if (pause == false) {
      pausePlayback();
    }
  });
  var correctBounds = [];
  var cs = $("." + theRegion);
  $("#helpText").empty();
  $("#helpText").html("<h1>Evaluating: <------- </h1>");
  var playbackLayer = totalLayers;
  var progressbar = $("#progressbar");
  var burnerbar = $("#burnerbar");
  progressbar.progressbar({
    value: false,
    max: totalReqPoints,
    change: function() {

    },
    complete: function() {

    }
  });

  burnerbar.progressbar({
    value: false,
    max: 150,
    change: function() {

    },
    complete: function() {

    }
  });
  var shownBurn = 0;

  //$("#brainDisplay").append("<button id='pause' onclick='pausePlayback();'>Pause</button><button id='rp' ");
  //$("#modal").addClass("fs-35");
  //$("#modal button").addClass("fs-22");
  resizeWindow();
  //resetQuestionState();

  function pausePlayback() {
    pause = !pause;
    console.log(pause + "for pause");
    if (pause == true) {
      document.getElementById("buttonPausePlayer").innerHTML = "&#9658";
      $("#buttonPrevPlayer").css("visibility", "visible");
      $("#buttonNextPlayer").css("visibility", "visible");
    } else {
      document.getElementById("buttonPausePlayer").innerHTML = "&#10074&#10074";
      $("#buttonPrevPlayer").css("visibility", "hidden");
      $("#buttonNextPlayer").css("visibility", "hidden");
      window.requestAnimationFrame(playResults);
    }
  }






  function playResults() {
    if ($(".picked").length == 0 && currentLayer == 0) {
      //;

      if (shownBurn < totalAfterBurnerScore) {
        console.log(shownBurn + " showburn");
        burnBar(5);
        shownBurn += 5;
        window.requestAnimationFrame(playResults);
        //Repeat until burnbar is filled properly
      } else {
        $("#helpText").html("<h1>DONE</h1>");

        totalAfterBurnerScore /= layerTotal;
        //console.log(totalAfterBurnerScore + "afterburnerscore");
        $(".checked").addClass("picked");
        currentLayer = totalLayers;
        endModal(cs, totalAfterBurnerScore)
        console.log("Playback ended");

      }

    } else {

      var afterBurnerCount;

      //console.log("Help!");

      updateWidgets(currentLayer);
      if ($("." + currentLayer + ".picked").length == 0) {
        currentLayer--;
        setTimeout(function() {
          if (!pause) {
            window.requestAnimationFrame(playResults);
          }
        }, timeOutTime);


      } else {

        colorPoints(currentLayer).then(
          function(val) {
            retValue = val;
            window.requestAnimationFrame(playResults)
            //console.log("ColorPoints returned: " + retValue);
            totalAfterBurnerScore += afterBurner(currentLayer);
            bumpBar(retValue);
          }


        );
      }
    }
  }
  playResults();
  computeBounds(correctBounds);




  function colorPoints(playbackLayer) {

    var deferred = jQuery.Deferred();
    var returnValue = 0;
    colorPoint()

    function colorPoint() {
      var points = $("." + playbackLayer + ".picked");

      var currentPointNum = 0;

      if (currentPointNum >= points.length) return returnValue;
      currentPoint = points[currentPointNum];
      //console.log($(currentPoint));
      $(currentPoint).removeClass("picked");
      $(currentPoint).addClass("checked");
      if ($(currentPoint).attr("id"))
        var id = $(currentPoint).attr("id").replace("point", "box")
      else returnValue += 0;

      //console.log( $(this).attr("id"))
      if ($(currentPoint).attr("isCorrect") == "true") {
        $(currentPoint).children().attr("src", "images/BrainPointer_CorrectSmall.svg")
        $("#" + id).css("background-color", "green");
        correctBounds.push(parseFloat($("#" + id).css("left") / 100));
        correctBounds.push(parseFloat($("#" + id).css("top") / 100));
        returnValue += 1;;
      } else {
        $(currentPoint).children().attr("src", "images/BrainPointer_IncorrectSmall.svg")
        $("#" + id).css("background-color", "red");
        returnValue += 0;
      }
      if ($("." + currentLayer + ".picked").length != 0) {
        setTimeout(colorPoint, timeOutTime * 3)
      } else {
        deferred.resolve(returnValue);

      }

    }
    return deferred;
    //console.log(currentRegion,num);


  }





}


function bumpBar(c) {
  var progressbar = $("#progressbar");
  var val = progressbar.progressbar("value") || 0;
  progressbar.progressbar("value", val + c);
}

function burnBar(c) {
  console.log(c);
  var burnerbar = $("#burnerbar");
  burnerbarValue = burnerbar.find(".ui-progressbar-value");
  burnerbarValue.css({
    "background": '#' + Math.floor(Math.random() * 16777215).toString(16)
  });
  var val = burnerbar.progressbar("value") || 0;
  burnerbar.progressbar("value", val + c);
}


function afterburnerDistance(leftp1, leftp2, topp1, topp2) {

  return Math.sqrt(Math.pow(parseFloat(leftp1) - parseFloat(leftp2), 2) + Math.pow(parseFloat(topp1) - parseFloat(topp2), 2)) / canvasWidthGlobal;


}

function afterBurner(layer) {
  var totalDistance = 0;


  var pointArray = $("." + layer + "[iscorrect='true']")

  for (i = 0; i < pointArray.length; i++) {
    for (j = 0; j < (pointArray.length - i); j++) {

      //console.log($(pointArray[i]).css("left"));

      totalDistance += afterburnerDistance($(pointArray[i]).css("left"), $(pointArray[j]).css("left"), $(pointArray[i]).css("top"), $(pointArray[j]).css("left"));

    }
  }

  return (totalDistance);
  console.log(totalDistance)
  //console.log($(this));
}

function rePlay() {
  $('#modal').remove();
  resetQuestionState();
  console.log("Pressed");
  loadCurrentQuestion();
  unbindAll(false);


}

function score() {
  $('#modal').remove();
  $(".picked img").attr("src", "images/BrainPointerSmall.svg");
  $(".checked").addClass("picked");
  $(".checked").removeClass("checked");
  playbackTheatre(currentRegion);
  pause = false;
  $("#playbackControls").css("visibility", "visible");
  updateWidgets(totalLayers);




}

function stripUnderscores() {
  //var spacedRegion = currentRegion("_"g, / /);
  //console.log(spacedRegion);
}

function endModal(cs, ab) {
  pause = null;
  var t = cs.length;
  $("#playbackControls").css("visibility", "hidden");
  $("#buttonPrevPlayer").css("visibility", "hidden");
  $("#buttonNextPlayer").css("visibility", "hidden");
  unbindAll(true);
  $("#questionSelect , #replayToggle, #infoToggle").css("pointerEvents", "auto");
  var g = cs.filter(function(x, el) {
    return $(el).attr("iscorrect") == "true"
  }).length;
  var b = cs.filter(function(x, el) {
    return $(el).attr("iscorrect") == "false"
  }).length;

  barTotal = Math.round(g * (100 / totalReqPoints));
  ab = Math.round(ab * 2);
  var finalValue = barTotal + ab;

  stripUnderscores();
  $("#brainDisplay").append("<div id='modal'><div><h2>Results: </h2><p>Correct: " + barTotal + "%</p>+<p>Distance Bonus:<br/> " + ab + "%</p><h2>Final Score: " + finalValue + "%</h2><button id='n' onclick='nextQuestion();'>Next Question</button><button id='rp' onclick='score()'>Replay Answer</button><button id='ta' onclick='rePlay()'>Try Again</button>  </div></div>");
  $("#modal").css("font-size", "1.8rem");
  $("#rp, #ta, #n").css("pointerEvents", "auto");
  $("#modal button").css("font-size", "1.15rem");
  $(".questionSelectBtn").css("backgroundColor", "white");
  resizeWindow();
  previousScores[globalQuestion[currentQuestionNum]["region"]] = true;
  $.ajax({
    type: "POST",
    url: "save.php",
    data: globalQuestion[currentQuestionNum]["region"] + '=' + barTotal + "&afterburner=" + ab
  });


}
nextQuestion = function() {
  cleanUpModal();
  currentQuestionNum++;
  resetQuestionState();
  updateButtons();
  unbindAll(false);




}

function cleanUpModal() {

  $('#modal').remove();
  if ($('#progressbar').progressbar("instance") !== undefined) $('#progressbar').progressbar("destroy");
  if ($('#burnerbar').progressbar("instance") !== undefined) $('#burnerbar').progressbar("destroy");

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
  $("#accordion").accordion("refresh");
  canvasWidthGlobal = parseFloat($("#brainDisplay").css("width"));
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

  // Resize corner border radii based on stage height


  var cornerSize = .025 * stageHeight;
  $(".rounded").css({
    '-webkit-border-radius': cornerSize + "px",
    '-moz-border-radius': cornerSize + "px",
    'border-radius': cornerSize + "px"
  });


  //Resize font-size for HTML type. Use rem measurement to set font-size
  $("html").css("font-size", (stageHeight / 60) + "px");


  //Outdated::
  // Resize text based on stage height

  // To give a class a certain font size, assign it the class "fs-X" where X is an integer between 1 and 1000. 1000 is the height of the screen.

  // New font resize loop
  // for (var i = 1; i <= 1000; i++) {
  //   var s = stageHeight * (i / 1000);
  //   var c = ".fs-" + i;
  //   $(c).css({
  //     'font-size': s + "px"
  //   });
  // }




}




if (!Object.keys) {
  Object.keys = function(obj) {
    var keys = [],
      k;
    for (k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        keys.push(k);
      }
    }
    return keys;
  };
}
