//Represent the following variables as part of a state, rather than having globals..
var state = {
  which: "",
  totalLayers: 34,
  requiredLayers: null,
  requiredLayers: null,
  globalPoly: null,
  currentQuestionNum: 0,
  totalReqPoints: null,
  curRegion: null,
  layerTotal: 0,
  pointsLayer: 0,
  drawOp: 0,
  aspectWidth: 16,
  aspectHeight: 9,
  scaleFactor: null,
  imageWidth: 512,
  selectionMarker: null,
  sagitalTopOffsetPercent: 50,
  sagitalAreaPercent: 100,
  inter: null,
  previousScores: null,
  leaderBoard: null,
  previousX: null,
  previousy: null,
  canvaswidthglobal: null,
  currentLayer: null,
  pause: undefined,
  mytimeout: null,
  brainType: "human",
  previousQuestionScores: null,
  user: null,
  submitted: false
};

const sensitivity = 120;
const timeOutTime = 70;
$(function() {
  var dfd = jQuery.Deferred();
  $.getJSON("getUsername.php", function(data) {
    state.user = data;
  }).fail(function(d, textStatus, error) {
    console.error("getJSON failed, status: " + textStatus + ", error: " + error)
  });
  state.brainType = location.hash.split("#")[1] || state.brainType;
  var brainTypes = ["dolphin", "human"];
  state.brainType = state.brainType.toLowerCase();
  if (!(brainTypes.includes(state.brainType))) state.brainType = "human";
  getImageTotal(state.brainType + "/layerImages/", 1, dfd).then(function(data) {
    state.totalLayers = data;
    console.log("^Don't worry about failed resource error, it's intentional^");
    load();
  });
});

function load() { // makes sure the whole site is loaded
  $('#status').fadeOut(); // will first fade out the loading animation
  $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
  $('body').delay(350).css({
    'overflow': 'visible'
  });
  $("#Sagital").attr("src", state.brainType + "/Sagital.png");
  loadPlayerButtons();
  $("#accordion").accordion({
    heightStyle: "fill"
  });
  useLeaderBScroll(true);
  useMouseWheelLayers(true);
  updateScoreData();

  $.getJSON(state.brainType + "/structures.json", function(data) {
    state.globalPoly = data;


    $.getJSON(state.brainType + "/questionBank.json", function(data) {
      state.globalQuestion = data;
      loadCurrentQuestion()
      showQuestionButtons()
      updateButtons();
      computeBounds(state.globalPoly[state.which]);
      resizeWindow();




      // output
    }); // input
  }); // input
  // compute
};

function useLeaderBScroll(status) {
  //Should always be scrollable, regardless of whether or not the on/off functions are on.
  $("#leaderB").css("pointerEvents", "auto");
  $("#leaderB").off();
  if (status == true) {
    $("#leaderB").on("mouseenter", function() {
      if ($("#leaderB").scrollTop() == 0) $("#leaderB").scrollTop(1); //if it is scrollable, this will remain at 1. However, if it is NOT scrollable, it will go back to zero.
      //^Do not change value upon rentry if the value is anything besides zero.
      var isScrollable = $("#leaderB").scrollTop() != 0;
      useMouseWheelLayers(!isScrollable);
    });
    $("#leaderB").on("mouseleave", function() {
      useMouseWheelLayers(true);
    });
  }
}

function updateScoreData() {

  //Data for username and all previous scores for this brain.
  $.getJSON("read.php", function(data) {
    state.user = data["user"];
    state.previousScores = data[state.brainType] || data;

    if (Object.keys(state.previousScores).length == 0) {
      startJoyride();
    }

  }).fail(function() {
    console.log("error - Previous scores");
  });

  //Get all highscores for this brain
  $.getJSON(state.brainType + "/highScores.json", function(data) {
    state.leaderBoard = data;
  }).fail(function() {
    console.log("error - leaderBoard");
  });
}


//Joyride is the tutorial, so this starts the tutorial. It keeps in mind the visibility states of the playback controls, since they do not always show.
function startJoyride() {
  var nextShowing;
  var prevShowing;
  var pauseShowing;
  $("#tourSelector").joyride({
    autoStart: true,
    postRideCallback: function() {
      //Fills back in the previous visibility before tutorial was called
      if (state.pause) {
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
      $(".tour").css("pointerEvents", "auto");
      $("#playbackControls").css("visibility", "visible");
      $("#buttonPrevPlayer").css("visibility", "visible");
      $("#buttonNextPlayer").css("visibility", "visible");
    },

    modal: true,

    expose: true
  });

}

//If true: Unbinds all UI functions, except for the scrolling on leader Board, if false, all UI becomes active.
function unbindAll(status) {
  //since opposite, !status
  useMouseWheelLayers(!status);
  if (status) {
    $("body").css("pointerEvents", "none")
  } else {
    $("body").css("pointerEvents", "auto")
  }
  useLeaderBScroll(!status);
}

//Enables/Disables mouse wheel scroll to change brain layers.
function useMouseWheelLayers(status) {
  $('#stage').off("mousewheel DOMMouseScroll"); //removes old wheels as to not stack.
  if (status == true) {
    $('#stage').on('mousewheel DOMMouseScroll', function(e) {

      var o = e.originalEvent;
      var delta = o && (o.wheelDelta || (o.detail && -o.detail));
      if (delta) {
        e.preventDefault();

        var step = Math.round(Math.abs(delta / sensitivity));
        step *= delta < 0 ? 1 : -1;

        var newVal = state.currentLayer - step;

        if ((newVal >= 1) && (newVal <= state.totalLayers)) {
          //console.log(newVal);
          updateWidgets(newVal);
        }
      }
    });
  }
}

//Updates leaderboard and your question high score.
function updateLeaderBoard() {
  updateScoreData();
  $("#leaderB").html("");
  updateButtons();
  if (state.leaderBoard) var questionLeaderB = state.leaderBoard[state.which]
  state.previousQuestionScores = state.previousScores[state.which];

  $("#leaderB").css({
    "font-size": "1.0rem",
    "overflow": "auto"
  });
  $("#leaderB").html(" ");
  if (state.previousQuestionScores) {
    var userTotal = state.previousQuestionScores["score"] + state.previousQuestionScores["ab"];
    $("#leaderB").append("<table><caption font-size='1.0rem'> Your Question High Score</caption><tbody><tr><th>NetID</th><th>Percent Correct</th><th>Distance Bonus</th><th>Total</th></tr><tr><td>" + state.user + "</td><td>" + state.previousQuestionScores["score"] + "</td><td>" + state.previousQuestionScores["ab"] + "</td><td>" + userTotal + "</td></tr>");
  }
  if (questionLeaderB) {
    var table = $("<table/>", {
      id: "leaderTable"
    });
    var tbody = $("<tbody/>", {
      id: "leaderTableBody"
    });
    table.append("<caption font-size='1.0rem'> Top 10 Question High Scores</caption>");
    tbody.append("<tr><th>NetID</th><th>Percent Correct</th><th>Distance Bonus</th><th>Total</th></tr>");
    table.append(tbody);
    $("#leaderB").append(table);

    for (i = 0; i < questionLeaderB.length; i++) {
      var activeR = questionLeaderB[i];
      var total = activeR["score"] + activeR["ab"];
      console.log(activeR);
      if (state.leaderBoard && activeR) $("#leaderTableBody").append("<tr><td>" + activeR["user"] + "</td><td>" + activeR["score"] + "</td><td>" + activeR["ab"] + "</td><td>" + total + "</td></tr></tbody></table>");
    }
  }

}

function showQuestionButtons() {



  $("#infoToggle,#infoClose").on("click", function() {
    var isVisible = $("#info").toggle().is(':visible');
    if ($("#playbackControls").css("visibility") == "visible") {
      console.log("isVi");
      if (isVisible) {
        $("#playbackControls, #restartToggle").css("pointerEvents", "none");

      } else {
        $("#playbackControls, #restartToggle").css("pointerEvents", "auto");
      }
    } else {
      unbindAll(isVisible);
    }
    $("#info").css("pointerEvents", "auto");
    resizeWindow();
  });






  $("#restartToggle").click(function() {
    startJoyride();
  });

  for (i = 0; i < state.globalQuestion.length; i++) {

    toolTip = state.globalQuestion[i]["region"];

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
    state.currentQuestionNum = parseInt($(event.target).data('num'));
    updateScoreData();
    unbindAll(false);
    resetQuestionState();
    updateLeaderBoard();
    cleanUpModal();
    updateButtons();

  })

}


function computeBounds(pointList) {


  var boxSize = [0, 0, 0];
  var maxCoords = [0, 0, 0];
  var minCoords = [1, 1, 1];
  $.each(pointList, function(index, value) {
    for (i = 0; i < value[0].length; i += 2) {
      var normX = value[0][i] / state.imageWidth;
      var normY = value[0][i + 1] / state.imageWidth;
      var normZ = index / state.totalLayers;

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

//Helper function for updateButtons that marks state of each question button.
function getUserHistory() {
  var questionBool = []
  $.each(state.globalQuestion, function(key, value) {
    questionBool.push(!!state.previousScores[value["region"]])
  })
  return questionBool
}

//Colors question buttons if based on status (answered, unanswered, current question)
function updateButtons() {

  usrArr = getUserHistory();
  $(".questionSelectBtn").css("background-color", "white");
  $(".questionSelectBtn").each(function(index, element) {


    if (index == state.currentQuestionNum) {
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
//Self-explainatory
function resetQuestionState() {
  $('#modal').remove();
  $("#questionText").typed("reset");
  $("#buttonPausePlayer").innerHTML = "&#10074&#10074";
  //state.submitted = false;

}

//loads the currently selected question
function loadCurrentQuestion() {

  updateButtons();


  $(".picked").remove();
  $(".joyride-content-wrapper").css("font-size", "1.2rem");
  $("#questionText").css("font-size", "1.2rem");
  resizeWindow();


  $("#gridTable").remove();
  //MasterOpacity
  state.drawOp = 0;
  state.totalReqPoints = state.globalQuestion[state.currentQuestionNum].pointsPerLayer * state.globalQuestion[state.currentQuestionNum].requestLayers;
  //drawSlider(); // output


  var theQuestion = state.globalQuestion[state.currentQuestionNum];
  state.requiredLayers = theQuestion.pointsPerLayer;
  if (theQuestion.selectionMarker) {
    state.selectionMarker = theQuestion.selectionMarker;
  } else {
    state.selectionMarker = null;
    delete obj;
  }
  var questionText = "Please pick " + theQuestion.pointsPerLayer + " points on " + theQuestion.requestLayers + " Layers in the <u>" + theQuestion.region + "</u><strong class='typed-cursor'> |</strong>";
  state.requiredLayers = theQuestion.requestLayers;
  state.which = theQuestion.region;
  state.currentRegion = "qn" + state.currentQuestionNum;
  updatePoints()
  $("#helpText").html("<p class='powerOn'>You have " + state.totalReqPoints + " points left to place, across " + theQuestion.requestLayers + " more Layers </p>");
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
  updateLeaderBoard();




  //$("#questionText").html(questionText)

  //console.log(state.selectionMarker);
  if (state.selectionMarker) updateWidgets(state.selectionMarker["layers"][0])
  else updateWidgets(state.totalLayers);
}

//updates Sagital View
function updateSagital(layer) {
  state.sagitalAreaPercent = 51.5;
  state.sagitalTopOffsetPercent = 15;
  //var sagitalHeight=parseFloat($("#sagitalView").css("height"));
  //var lineTop =((sagitalHeight*state.sagitalAreaPercent/100)/state.totalLayers)*(state.totalLayers-layer)+state.sagitalTopOffsetPercent;
  //console.log(lineTop,state.totalLayers,state.sagitalAreaPercent,layer,state.sagitalTopOffsetPercent);
  lineTop = (state.totalLayers - layer) * (state.sagitalAreaPercent / state.totalLayers) + state.sagitalTopOffsetPercent;

  $("#sagitaLine").css("top", lineTop + "%");




}

//Updates layer and points
function updateWidgets(layer) {
  if (layer > state.totalLayers || layer <= 0) return;
  //console.log(layer);
  state.currentLayer = layer;
  $(".pointerCell").css("opacity", 0);
  $("#pointerCellrow_" + layer).css("opacity", 1);
  //$("#sliderDiv").slider("value", layer);

  //$( "#sliderDiv" ).focus();
  updatePoints(layer);
  updateSagital(layer);


}

//Draws table for points
function drawGrid() { // 2 Calls by addToClickList, $(document).ready

  var rows = state.totalLayers;
  var delay = 0;
  var tableMade = $('#gridTable').get(0);
  if (!tableMade) $('#gridList').append("<table id='gridTable'></table>");
  var boxPercent = 100 / (state.requiredLayers + 2);
  for (n = rows; n > 0; n--) {

    if (!tableMade) {
      var currentRowId = 'row_' + n;
      var tableRow = $("<tr/>", {
        "class": "gridRow",
        "id": currentRowId
      })

      $('#gridTable').append(tableRow);
    }


    var pointerCell = $("<td/>", {
      id: "pointerCell" + currentRowId,
      style: "width:" + boxPercent + "%",
      class: "pointerCell"
    });
    if ($("#pointerCell" + currentRowId).length == 0) {
      $('#' + currentRowId).append(pointerCell);
    }






    for (m = 0; m < state.requiredLayers; m++) {

      currentGrid = $('#gridTable #box_' + n + "_" + m)

      if (!tableMade) {
        $('#' + currentRowId).append("<td id='box_" + n + "_" + m + "' style='width:" + boxPercent + "%' class='gridBox'></td>");
        if (m == state.requiredLayers - 1) {
          $('#' + currentRowId).append("<td id='erase_" + n + "' class='strobeBtn' style='visibility: hidden;'></td>");
          $("#" + "erase_" + n).click(function() {
            $("." + this.id.split("_")[1]).remove();
            drawGrid();
            checkPointCount(state.currentRegion);
          })
        }

      } else if (m < $("." + n + '.' + state.currentRegion).length) {

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
  if (!tableMade) { //first time drawgrid is called, it creates the time buffer .on functions. This prevents stacking issues..
    $("#gridList").on("mouseenter mouseleave", function() {
      useMouseWheelLayers(true);
      clearTimeout(state.mytimeout)
      delay = 500;
    });
    $('.gridRow').on("click mouseenter", function(evt) {
      useMouseWheelLayers(false);
      state.mytimeout = setTimeout(function() {
        var thisRowNum = evt.currentTarget.id.split("_")[1];
        updateWidgets(thisRowNum);
        delay = 0;
      }, delay);
    });
  }
}

function updatePoints(layer) { // 2 Call by DrawSlider, Index.html
  for (var i = 1; i <= state.totalLayers; i++) {
    $('.' + i).hide();
    if (i == layer) {
      $('.' + state.currentRegion + '.' + i).show();

      changePic(layer)
      drawMultiPoly()
    }
  }
}

function changePic(i) {
  $('#brainPic')[0].src = state.brainType + "/layerImages/" + i + ".jpg";
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
  state.scaleFactor = state.imageWidth / canvasWidth;

}




function drawMultiPoly() {



  drawWrongClicks()
  layerIndex = state.currentLayer
  $('canvas').removeLayerGroup("group" + layerIndex);


  var curRegion = state.globalPoly[state.which];
  var curSlice = curRegion[layerIndex];
  //canvasClearing();



  if (curSlice) $.each(curSlice, function(i, el) {

    drawPoly(layerIndex, i, curSlice[i]);

    if (state.selectionMarker && layerIndex >= state.selectionMarker.layers[0] && layerIndex <= state.selectionMarker.layers[1]) {

      $('canvas').drawArc({
        fillStyle: '#0F0',
        x: state.selectionMarker.location[0] / state.scaleFactor,
        y: state.selectionMarker.location[1] / state.scaleFactor,
        radius: 8 / state.scaleFactor,
        layer: true,
        name: "MC indicator",
        groups: ["group" + layerIndex]
      });
    }




  });


  for (var i = 1; i <= state.totalLayers; i++) {
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
    opacity: state.drawOp,
    // opacity: true,
    groups: ["group" + layerIndex],
    fillStyle: 'orange',
    click: function(e) {

      addToClickList(e._eventX, e._eventY, true);

    }
  };
  for (var p = 0; p < curPoly.length; p += 2) {
    obj['x' + (p / 2 + 1)] = curPoly[p] / state.scaleFactor;
    obj['y' + (p / 2 + 1)] = curPoly[p + 1] / state.scaleFactor;
  }
  $('canvas').drawLine(obj);

};




function addToClickList(ex, ey, isCorrect) { // 2 calls from canvasClearing, drawPoly
  var fudgeX = 2.65;
  var fudgeY = 4.35;
  var percentX = ex / stageWidth * 100 + fudgeX;
  var percentY = ey / stageHeight * 100 + fudgeY;
  //alert(ey);
  //var state.currentLayer = $("#sliderDiv").slider("value");
  var currentElement = $('.' + state.currentLayer)
  //console.log(activeLayers());
  if ((activeLayers()) >= state.requiredLayers && currentElement.length == 0) {
    //No warning?
    // focusLayerErase();
    // toggleStatic(true);
    // $("#helpText").html("<h3>You've exceded the number of layers, please delete your points off one layer</h3>");
    return null;
  }

  if (currentElement.length >= state.requiredLayers) {
    //console.log(currentElement.length)
    currentElement[currentElement.length - 1].remove();

  }
  var availableSpace = 0;
  for (i = 0; i < state.requiredLayers; i++) {
    if ($("#point_" + state.currentLayer + "_" + i).length == 0) {
      console.log(i);
      availableSpace = i;
      break;
    }
  }

  //clickList.push({"regionName":state.which,"left":ex, "top":ey,"layerNum":state.currentLayer,"isCorrect":isCorrect} )
  //Makes sure you can't like, click on the same point a bunch of times in a row, state.which was a thing that happened.
  if ((percentX != state.previousX) && (percentY != state.previousy)) {
    var idName = "point_" + state.currentLayer + "_" + availableSpace
    state.pointsLayer = currentElement.length;

    $("#brainDisplay").append("<div onclick='$(this).remove();drawGrid();checkPointCount(state.currentRegion);' isCorrect='" + isCorrect + "' class='" + state.currentLayer + " " + state.currentRegion + " pointerImage picked' style='position:absolute; left:" + percentX + "%; top: " + percentY + "%;' id='" + idName + "'><img src='images/BrainPointerSmall.svg'/></div>");
    state.previousX = percentX;
    state.previousy = percentY;
  }

  /*
	   $("#" + idName).css({
	   "left": ex + "px",
	   "top": ey + "px"
	   });
	   */
  drawGrid();

  checkPointCount(state.currentRegion);
  state.layerTotal = activeLayers();
}



function activeLayers() {
  var totalRows = 0;

  var rows = state.totalLayers;
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
  var pointsLeft = state.totalReqPoints - t
  var pointPerLayer = state.requiredLayers - state.pointsLayer;

  $("#helpText").html("You have " + pointsLeft + " points left to place, across " + (state.requiredLayers - activeLayers()) + " more Layers");
  if (pointPerLayer <= 3 && pointPerLayer > 1) $("#helpText").append("<p>You need " + (pointPerLayer - 1) + " points on this Layer.</p>");
  else $("#helpText").append("<p>You have enough points here.</p>");

  if (!(pointsLeft >= 0 && t < state.totalReqPoints)) {
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
      unbindAll(true);
      setTimeout(function() {
        state.currentLayer = state.totalLayers;
        state.drawOp = 0.5;
        playbackTheatre(state.currentRegion);
      }, 125); //waits half a second
    })
  }
}

function loadPlayerButtons() {
  $("#playbackControls").css("visibility", "hidden");
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
    checkPointCount(state.currentRegion);
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
  $(".questionSelectBtn").css("pointerEvents", "none");
  $("#infoToggle").css("pointerEvents", "auto");
  $("#restartToggle").css("pointerEvents", "auto");
  $("#buttonPausePlayer, #buttonNextPlayer,  #buttonPrevPlayer").off();
  $("#buttonPausePlayer").on("click", function() {
    pausePlayback();
  });
  $("#buttonNextPlayer").on("click", function() {
    state.currentLayer--;
    playResults();
  });
  $("#buttonPrevPlayer").on("click", function() {
    updateWidgets(state.currentLayer + 1);
  });
  $("#playbackControls").css("visibility", "visible");
  document.getElementById("buttonPausePlayer").innerHTML = "&#10074&#10074";
  console.log("Loading playback theatre")
  var totalAfterBurnerScore = 0;
  state.pause = false;
  $("#restartToggle").on('click', function() {
    if (state.pause == false) {
      pausePlayback();
    }
  });
  $("#infoToggle").on('click', function() {
    if (state.pause == false) {
      pausePlayback();
    }
  });
  var correctBounds = [];
  var cs = $("." + theRegion);
  $("#helpText").empty();
  $("#helpText").html("<h1>Evaluating: <------- </h1>");
  var playbackLayer = state.totalLayers;
  var progressbar = $("#progressbar");
  var burnerbar = $("#burnerbar");
  progressbar.progressbar({
    value: false,
    max: state.totalReqPoints,
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

  //$("#brainDisplay").append("<button id='state.pause' onclick='pausePlayback();'>state.pause</button><button id='rp' ");
  //$("#modal").addClass("fs-35");
  //$("#modal button").addClass("fs-22");
  resizeWindow();
  //resetQuestionState();

  function pausePlayback() {
    state.pause = !state.pause;
    if (state.pause == true) {
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
    if ($(".picked").length == 0 && state.currentLayer == 0) {
      //;

      if (shownBurn < totalAfterBurnerScore) {
        console.log(shownBurn + " showburn");
        burnBar(5);
        shownBurn += 5;
        window.requestAnimationFrame(playResults);
        //Repeat until burnbar is filled properly
      } else {
        $("#helpText").html("<h1>DONE</h1>");

        totalAfterBurnerScore /= state.layerTotal;
        //console.log(totalAfterBurnerScore + "afterburnerscore");
        $(".checked").addClass("picked");
        state.currentLayer = state.totalLayers;
        endModal(cs, totalAfterBurnerScore)
        console.log("Playback ended");

      }

    } else {

      var afterBurnerCount;

      //console.log("Help!");

      updateWidgets(state.currentLayer);
      if ($("." + state.currentLayer + ".picked").length == 0) {
        setTimeout(function() {
          if (!state.pause) {
            state.currentLayer--;
            window.requestAnimationFrame(playResults);
          }
        }, timeOutTime);


      } else {

        colorPoints(state.currentLayer).then(
          function(val) {
            retValue = val;
            window.requestAnimationFrame(playResults)
            //console.log("ColorPoints returned: " + retValue);
            totalAfterBurnerScore += afterBurner(state.currentLayer);
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
      if ($("." + state.currentLayer + ".picked").length != 0) {
        setTimeout(colorPoint, timeOutTime * 10);
      } else {
        deferred.resolve(returnValue);

      }

    }
    return deferred;
    //console.log(state.currentRegion,num);


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

  return Math.sqrt(Math.pow(parseFloat(leftp1) - parseFloat(leftp2), 2) + Math.pow(parseFloat(topp1) - parseFloat(topp2), 2)) / state.canvaswidthglobal;


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
  state.pause = false;
  //state.submitted = true;
  playbackTheatre(state.currentRegion);
  $("#playbackControls").css("visibility", "visible");
  updateWidgets(state.totalLayers);




}

function stripUnderscores() {
  //var spacedRegion = state.currentRegion("_"g, / /);
  //console.log(spacedRegion);
}

function endModal(cs, ab) {

  var t = cs.length;
  $(".questionSelectBtn").css("pointerEvents", "auto");
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

  barTotal = Math.round(g * (100 / state.totalReqPoints));
  ab = Math.round(ab * 2);
  var finalValue = barTotal + ab;

  stripUnderscores();
  $("#brainDisplay").append("<div id='modal'><div><h2>Results: </h2><p>Correct: " + barTotal + "%</p>+<p>Distance Bonus:<br/> " + ab + "%</p><h2>Final Score: " + finalValue + "%</h2><button id='n' onclick='nextQuestion();'>Next Question</button><button id='rp' onclick='score()'>Replay Answer</button><button id='ta' onclick='rePlay()'>Try Again</button>  </div></div>");
  $("#modal").css("font-size", "1.8rem");
  $("#rp, #ta, #n").css("pointerEvents", "auto");
  $("#modal button").css("font-size", "1.15rem");
  $(".questionSelectBtn").css("backgroundColor", "white");
  $("#questionSelect").css("pointerEvents", "inherit");
  resizeWindow();
  //if (state.submitted == false) {
  $.ajax({
    type: "POST",
    url: "save.php",
    data: {
      "brain": state.brainType,
      "question": state.which,
      "score": barTotal,
      "afterburner": ab
    }
  }).fail(function(d, textStatus, error) {
    console.error("getJSON failed, status: " + textStatus + ", error: " + error)
  }).done(function() {
    updateLeaderBoard();
  });
  //}




}
nextQuestion = function() {
  cleanUpModal();
  state.currentQuestionNum++;
  updateLeaderBoard();
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
  state.canvaswidthglobal = parseFloat($("#brainDisplay").css("width"));
  var w = $(window).width();
  var h = $(window).height();
  // If the window aspect ratio >=  screen aspect, fix height and set width based on height
  if ((w / h) >= state.aspectWidth / state.aspectHeight) {
    stageHeight = h;
    stageWidth = (state.aspectWidth / state.aspectHeight) * h;
    stageLeft = (w - stageWidth) / 2;
    stageTop = 0;


  }
  // If the window aspect ratio < than screen aspect, fix width and set height based on width
  else {
    stageWidth = w;
    stageHeight = (state.aspectHeight / state.aspectWidth) * w;
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
