//Represent the following variables as part of a state, rather than having globals..
var state = {
  which: "",
  totalLayers: 34,
  requiredLayers: null,
  totalReqPoints: null,
  globalPoly: null,
  currentQuestionNum: 0,
  curRegion: null,
  layerTotal: 0,
  pointsLayer: -1,
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
  submitted: false,
  firstPause: true,
  questionScore: 0,
  maxDistances : null,
  playback: false,
};

const sensitivity = 120;
const timeOutTime = 70;
const passScore = 70;


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
      $(window).on("resize", function() {
        resizeWindow();
        drawMultiPoly();
        console.log("Resize");
      }).trigger("resize");




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
  var deferred = jQuery.Deferred();
  //Data for username and all previous scores for this brain.
  //Once this is completed, pull the
  $.getJSON("read.php", function(data) {
    state.user = data["user"];
    $("#title").html("Brain Picker -"+state.user);
    state.previousScores = data[state.brainType] || data;

    if (Object.keys(state.previousScores).length == 0) {
      startJoyride();
    }

  }).always(function() {
    //Get all highscores for this brain
    $.getJSON(state.brainType + "/highScores.json", function(data) {
      state.leaderBoard = data;
    }).done(function() {
      deferred.resolve();
    }).fail(function() {
      console.log("error - leaderBoard");
      deferred.resolve();
    });
  }).fail(function() {
    console.log("error - Previous scores");
  });

  return deferred;
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

  console.log("updating lederboard");
  updateScoreData().then(function() {
    $("#leaderB").html("");
    updateButtons();
    if (state.leaderBoard) var questionLeaderB = state.leaderBoard[state.which]
    if (state.previousScores) state.previousQuestionScores = state.previousScores[state.which];

    $("#leaderB").css({
      "font-size": "1.0rem",
      "overflow": "auto"
    });
    $("#leaderB").html(" ");
    if (state.previousQuestionScores) {
      var userTotal = state.previousQuestionScores["score"] + state.previousQuestionScores["ab"];
      var table = $("<table/>").append($("<tbody/>"));
      var caption = $("<caption/>", {
        fontSize: "1.0rem",
        text: "Your Question High Score"
      });
      table.append(caption);
      var headRow = $("<tr/>");
      headRow.append($("<th/>").html("Net ID"));
      headRow.append($("<th/>").html("Percent Correct"));
      headRow.append($("<th/>").html("Distance Bonus"));
      headRow.append($("<th/>").html("Total"));
      table.append(headRow);
      var dataRow = $("<tr/>");
      dataRow.append($("<td/>").html(state.user));
      dataRow.append($("<td/>").html(state.previousQuestionScores["score"]));
      dataRow.append($("<td/>").html(state.previousQuestionScores["ab"]));
      dataRow.append($("<td/>").html(userTotal));
      table.append(dataRow);

      $("#leaderB").append(table);

      //"<table><caption font-size='1.0rem'> Your Question High Score</caption><tbody><tr><th>NetID</th><th>Percent Correct</th><th>Distance Bonus</th><th>Total</th></tr><tr><td>" + state.user + "</td><td>" + state.previousQuestionScores["score"] + "</td><td>" + state.previousQuestionScores["ab"] + "</td><td>" + userTotal + "</td></tr>");
    }
    if (questionLeaderB) {
      table = $("<table/>").append($("<tbody/>"));
      caption = $("<caption/>", {
        fontSize: "1.0rem",
        text: "Top 10 Question Scores"
      });
      table.append(caption);
      var headRow = $("<tr/>");
      headRow.append($("<th/>").html("Net ID"));
      headRow.append($("<th/>").html("Percent Correct"));
      headRow.append($("<th/>").html("Distance Bonus"));
      headRow.append($("<th/>").html("Total"));
      table.append(headRow);
      for (i = 0; i < questionLeaderB.length; i++) {
        var activeR = questionLeaderB[i];
        if (activeR) var total = activeR["score"] + activeR["ab"];
        if (state.leaderBoard && activeR) {
          var dataRow = $("<tr/>");
          dataRow.append($("<td/>").html(activeR["user"]));
          dataRow.append($("<td/>").html(activeR["score"]));
          dataRow.append($("<td/>").html(activeR["ab"]));
          dataRow.append($("<td/>").html(total));
          table.append(dataRow);
          //Old Method:
          //$("#leaderTableBody").append("<tr><td>" + activeR["user"] + "</td><td>" + activeR["score"] + "</td><td>" + activeR["ab"] + "</td><td>" + total + "</td></tr></tbody></table>");
        }
      }
      $("#leaderB").append(table);
    }
  });
}

function showQuestionButtons() {



  $("#infoToggle,#infoClose").on("click", function() {
    var isVisible = $("#info").toggle().is(':visible');
    console.log(isVisible);
    if ($("#playbackControls").css("visibility") == "visible") {
      console.log("isVi");
      if (isVisible) {
        $("#playbackControls, #restartToggle").css("pointerEvents", "none");

      } else {
        $("#playbackControls, #restartToggle").css("pointerEvents", "auto");
      }
    } else {
      unbindAll(isVisible);
      if (isVisible) $("#rp, #ta, #n, #modal, #questionSelect, .questionSelectBtn").css("pointerEvents", "none");
      else $("#rp, #ta, #n, #modal, #questionSelect, .questionSelectBtn").css("pointerEvents", "auto");
    }
    $("#info").css("pointerEvents", "auto");
    //resizeWindow();
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
  maxDistance(pointList).then(function(){
    console.log(state.maxDistances);
    var boxSize = [0, 0, 0];
    var maxCoords = [0, 0, 0];
    var minCoords = [1, 1, 1];
    $.each(pointList, function(index, value) {
      if (!value[0]) return true; //for some reason, the loop will iterate even if the value is empty and cause error. So, if no value, continue to next iteration.
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

  });

}
function maxDistance(questionPointList) {
  dfd = jQuery.Deferred();
  state.maxDistances= [];
  var max_dist = 0;
  $.each(questionPointList, function(index, value){
    var layerPoints = value[0];
    if (!layerPoints) return true //returing true is continue for jQuery each statement
    for (i=0; i<layerPoints.length-1; i+=2) {
      for (j=i+2; j<layerPoints.length-1; j+=2) {
        var x1 = layerPoints[i];
        var y1 = layerPoints[i+1];
        var x2 = layerPoints[j];
        var y2 = layerPoints[j+1];
        max_dist = Math.max(max_dist, Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)));
      }
    }
    state.maxDistances[index] = max_dist*state.scaleFactor;
  });
  dfd.resolve();
  return dfd;
}
// function calculateAreas(pointListAllLayers) {
//   dfd = jQuery.Deferred();
//   var newPoints= {};
//   state.questionAreas = [];
//   $.each(pointListAllLayers, function(index, value){
//     var pointListLayer = value[0];
//     //The following two are stored so the polygon can close at the end.
//     if(!pointListLayer) return true;
//     newPoints[index] = []
//     newPoints[index][0]=pointListLayer;
//     var firstX = pointListLayer[0];
//     var firstY = pointListLayer[1];
//     var total = 0;
//     for (i=0; i<pointListLayer.length-3; i+=2) {
//       var x1 = pointListLayer[i];
//       var y1 = pointListLayer[i+1];
//       var x2 = pointListLayer[i+2];
//       var y2 = pointListLayer[i+3];
//       if(i==pointListLayer.length-1) {
//         x2 = firstX;
//         y2 = firstY;
//       }
//       total += x1*y2 - y1*x2;
//     }
//     total = Math.abs(total/2);
//     var canvasArea = parseFloat($("#brainDisplay").css("width")) * parseFloat($("#brainDisplay").css("height"));
//     state.questionAreas[index] = (total/canvasArea)*100; //makes it a percent value of the area of the canvas.
//   });
//   dfd.resolve(newPoints);
//   return dfd;
// }

//Helper function for updateButtons that marks state of each question button.
function getUserHistory() {
  var questionColors = []
  var dfd = jQuery.Deferred();
  $.each(state.globalQuestion, function(key, value) {
    if (state.previousScores) var value = state.previousScores[value["region"]];
    score = -1;
    if (value) score = value["score"]+value["ab"];
    questionColors.push(score);
  })
  dfd.resolve(questionColors);
  return dfd;
}

//Colors question buttons if based on status (answered, unanswered, current question)
function updateButtons() {
  getUserHistory().then(function(usrArr){
    $(".questionSelectBtn").css("background-color", "white");
    $(".questionSelectBtn").each(function(index, element) {
      if (index == state.currentQuestionNum) $(this).css("background-color", "yellow")
      else if (usrArr[index] >= passScore) $(this).css("background-color", "green")
      else if (usrArr[index]<0) $(this).css("background-color", "white");
      else $(this).css("background-color", "red");
    });
  });
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
  //resizeWindow();


  $("#gridTable").remove();
  //MasterOpacity
  state.drawOp = 0;
  state.totalReqPoints = state.globalQuestion[state.currentQuestionNum].pointsPerLayer * state.globalQuestion[state.currentQuestionNum].requestLayers;
  //drawSlider(); // output


  var theQuestion = state.globalQuestion[state.currentQuestionNum];
  state.requiredLayers = theQuestion.requestLayers;
  if (theQuestion.selectionMarker) {
    state.selectionMarker = theQuestion.selectionMarker;
  } else {
    state.selectionMarker = null;
    delete obj;
  }
  var questionText = "Please pick " + theQuestion.pointsPerLayer + " points on " + theQuestion.requestLayers + " Layers in the <u>" + theQuestion.region + "</u><strong class='typed-cursor'> |</strong>";
  state.requiredLayers = theQuestion.requestLayers;
  state.which = theQuestion.region;
  computeBounds(state.globalPoly[state.which]);
  state.currentRegion = "qn" + state.currentQuestionNum;
  updatePoints()
  $("#helpText").html("<p class='powerOn'>You have " + state.totalReqPoints + " points left to place, across " + state.requiredLayers + " more Layers </p>");
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
  if (!state.playback) {//Updates help text based on layer
    state.pointsLayer = $('.' + state.currentLayer).length-1;
    checkPointCount(state.currentRegion);
  }
  $(".pointerCell").css("opacity", 0);
  $("#pointerCellrow_" + layer).css("opacity", 1);
  //$("#sliderDiv").slider("value", layer);

  //$( "#sliderDiv" ).focus();
  updatePoints(layer);
  updateSagital(layer);


}

//Draws table for points
function drawGrid() { // 2 Calls by addToClickList, $(document).ready
  var theQuestion = state.globalQuestion[state.currentQuestionNum];
  var columns = theQuestion.pointsPerLayer;
  var rows = state.totalLayers;
  var delay = 0;
  var tableMade = $('#gridTable').get(0);
  if (!tableMade) $('#gridList').append($("<table/>", {
    id: "gridTable"
  }));
  var boxPercent = 100 / (columns + 2);
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






    for (m = 0; m < columns; m++) {

      currentGrid = $('#gridTable #box_' + n + "_" + m)

      if (!tableMade) {
        $('#' + currentRowId).append($("<td/>", {
          id: "box_" + n +"_" + m,
          style: "width:" +boxPercent + "%",
          class: "gridBox"
        }));
        if (m == columns - 1) {
          $('#' + currentRowId).append($("<td/>", {
            id: "erase_" + n,
            class : "strobeBtn",
            style: "visibility: hidden"
          }));
          $("#" + "erase_" + n).click(function() {
            $("." + this.id.split("_")[1]).remove();
            state.pointsLayer = -1;
            checkPointCount(state.currentRegion);
            drawGrid();

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

function updatePoints(layer) { // 2 Call by DrawGrid, Index.html
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
  var w = parseFloat($("#stage").width());
  var h = parseFloat($("#stage").height());
  var percentX = ex / w * 100 + fudgeX;
  var percentY = ey / h * 100 + fudgeY;
  var cols = state.globalQuestion[state.currentQuestionNum].pointsPerLayer;
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

  if (currentElement.length >= cols) {
    //console.log(currentElement.length)
    currentElement[currentElement.length - 1].remove();

  }
  var availableSpace = 0;
  for (i = 0; i < cols; i++) {
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


    $("#brainDisplay").append($("<div/>", {
      isCorrect : isCorrect,
      class : state.currentLayer + " " +state.currentRegion + " pointerImage picked",
      id: idName
    }).on("click", function() {
      $(this).remove();
      state.pointsLayer = state.pointsLayer-1;
      drawGrid();
      checkPointCount(state.currentRegion);
    }));
    $("#" +idName).css({
      position: "absolute",
      left: " "+percentX + "%",
      top: " "+percentY + "%"
    });
    $("#"+idName).append($("<img/>").attr("src",'images/BrainPointerSmall.svg'));
    //Previous appending method: $("#brainDisplay").append("<div onclick='$(this).remove();drawGrid();checkPointCount(state.currentRegion);' isCorrect='" + isCorrect + "' class='" + state.currentLayer + " " + state.currentRegion + " pointerImage picked' style='position:absolute; left:" + percentX + "%; top: " + percentY + "%;' id='" + idName + "'><img src='images/BrainPointerSmall.svg'/></div>");
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
  var cols = state.globalQuestion[state.currentQuestionNum].pointsPerLayer;
  var t = cs.length;
  //console.log(t);
  var pointsLeft = state.totalReqPoints - t
  console.log(state.currentLayer);
  var pointPerLayer = cols - state.pointsLayer;

  $("#helpText").html("You have " + pointsLeft + " points left to place, across " + (state.requiredLayers - activeLayers()) + " more Layers");
  if (state.pointsLayer==-1)  {} //Do nothing - effectively removes the help text;
  else if (pointPerLayer > 1) $("#helpText").append($("<p/>", {id: "helpLayer"}).html("You need "+(pointPerLayer-1)+ " points on this Layer."));
  //$("#helpText").append("<p>You need " + (pointPerLayer - 1) + " points on this Layer.</p>");
  else $("#helpText").append($("<p/>").html("You have enough points on this layer"));
  //$("#helpText").append("<p>You have enough points here.</p>");

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
  state.playback = true;
  $("#playbackControls").css("pointerEvents", "auto");
  $(".questionSelectBtn").css("backgroundColor", "#a6a9ad");
  $(".questionSelectBtn").css("pointerEvents", "none");
  $("#infoToggle").css("pointerEvents", "auto");
  $("#restartToggle").css("pointerEvents", "auto");
  //$("#buttonPausePlayer, #buttonNextPlayer,  #buttonPrevPlayer").off();

  $("#playbackControls").css("visibility", "visible");
  document.getElementById("buttonPausePlayer").innerHTML = "&#10074&#10074";
  console.log("Loading playback theatre")
  var totalAfterBurnerScore = 0;

  if (state.firstPause) {
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
    state.firstPause = false;
  }

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
  //resizeWindow();
  //resetQuestionState();

  function pausePlayback() {
    state.pause = !state.pause;
    if (state.pause == true) {
      document.getElementById("buttonPausePlayer").innerHTML = "&#9658";
      if ($("#playbackControls").css("visibility") == "hidden") return;
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

      burnBar(totalAfterBurnerScore/state.requiredLayers*10);
      $("#helpText").html("<h1>DONE</h1>");
      //console.log(totalAfterBurnerScore + "afterburnerscore");
      $(".checked").addClass("picked");
      state.currentLayer = state.totalLayers;
      console.log("Afterburner: "+totalAfterBurnerScore);
      endModal(cs, totalAfterBurnerScore/state.requiredLayers);
      state.playback = false;
      console.log("Playback ended");

      }

    else {

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
        setTimeout(function(){
        colorPoints(state.currentLayer).then(
          function(val) {
            retValue = val;
            //console.log("ColorPoints returned: " + retValue);
            afterBurner(state.currentLayer).then(function(ab){
              totalAfterBurnerScore+=ab;
              window.requestAnimationFrame(playResults);
            });



          }


        );
      },timeOutTime*5);
      }
    }
  }
  playResults();
  bumpBar();




  function colorPoints(playbackLayer) {
    var deferred = jQuery.Deferred();
      return colorPoint();
    function colorPoint() {

      var returnValue = 0;
      var points = $("." + playbackLayer + ".picked");
      var currentPointNum = 0;
      if (currentPointNum >= points.length) {deferred.resolve(returnValue); return deferred};
      currentPoint = points[currentPointNum];
      //console.log($(currentPoint));
      $(currentPoint).removeClass("picked");
      $(currentPoint).addClass("checked");
      if ($(currentPoint).attr("id"))
        var id = $(currentPoint).attr("id").replace("point", "box")


      //console.log( $(this).attr("id"))
      if ($(currentPoint).attr("isCorrect") == "true") {
        state.questionScore++;
        $(currentPoint).children().attr("src", "images/BrainPointer_CorrectSmall.svg")
        $("#" + id).css("background-color", "green");
        correctBounds.push(parseFloat($("#" + id).css("left") / 100));
        correctBounds.push(parseFloat($("#" + id).css("top") / 100));

      } else {
        $(currentPoint).children().attr("src", "images/BrainPointer_IncorrectSmall.svg")
        $("#" + id).css("background-color", "red");

      }
      if ($("." + state.currentLayer + ".picked").length != 0) {
        console.log("calling color");
        setTimeout(colorPoint, timeOutTime * 10);
      } else {
        deferred.resolve(returnValue);

      }

    return deferred;
    //console.log(state.currentRegion,num);
  }
}




}


function bumpBar() {
  var i = 0;
    var progressbar = $("#progressbar");
    var timeOutBar = setInterval(function(){
    var val = progressbar.progressbar("value") || 0;
    if ((val<state.questionScore)) { progressbar.progressbar("value", val+.11);}
    if (state.playback == false && val>=state.questionScore) clearInterval(timeOutBar);
  },timeOutTime);
    state.questionScore = 0.00;
}

function burnBar(c) {
  var burnerbar = $("#burnerbar");
  burnerbarValue = burnerbar.find(".ui-progressbar-value");
  burnerbarValue.css({
    "background": '#' + Math.floor(Math.random() * 16777215).toString(16)
  });
  var val = burnerbar.progressbar("value") || 0;
  var i = 0;
  var bar = setInterval(function(){
      i++;
      if (val+i>c*1.5) clearInterval(bar);
      burnerbar.progressbar("value", val + i);
  },15);
}


//Outdated: Distance bonus is now calculated on point area relative to total area, not distance between two points.
// function afterburnerDistance(leftp1, leftp2, topp1, topp2, layer) {
//
//   var distance = Math.sqrt(Math.pow(parseFloat(leftp1) - parseFloat(leftp2), 2) + Math.pow(parseFloat(topp1) - parseFloat(topp2), 2));
//   console.log("Area: "+state.questionAreas[layer] +"Distance: "+distance);
//   return Math.abs((distance-state.questionAreas[layer])/state.questionAreas[layer]);
//
//
// }

function afterBurner(layer) {
  var dfd = jQuery.Deferred();
  var dist = 0;
  var divider = 0;
  var pointArray = $("." + layer + "[iscorrect='true']");
  if (pointArray.length<state.requiredLayers) {dfd.resolve(0); return dfd;}
  for (i=0; i<pointArray.length; i++) {
    var x1 = parseFloat($(pointArray[i]).css("left"));
    var y1 = parseFloat($(pointArray[i]).css("top"));
    for (j=i+1; j<pointArray.length; j++) {
      var x2 = parseFloat($(pointArray[j]).css("left"));
      var y2 = parseFloat($(pointArray[j]).css("top"));
      dist += Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
      divider++;
    }
  }
  console.log("Divider:"+divider);
  var avgDist = (dist/divider)*state.scaleFactor; //gets average distance between points
  console.log("Avg dist:" +avgDist);
  console.log("Max:" +state.maxDistances[layer]);
  var returnScore = 10*(1-Math.abs((avgDist-state.maxDistances[layer])/state.maxDistances[layer]));
  console.log(returnScore);
  dfd.resolve(returnScore);
  return dfd;
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
  ab = Math.round(ab);
  var finalValue = barTotal + ab;

  stripUnderscores();
  var modal = $("<div/>", {
    id: "modal"
  });
  var divInModal = $("<div/>").append($("<h2/>").html("Results: "));
  var scoreText = $("<p/>").html("Correct: "+barTotal+"%");
  var afterburnerText = $("<p/>").html("Distance Bonus: <br>"+ab+"%");
  var finalText = $("<h2/>").html("Final Score: "+finalValue+"%");
  var nextBtn = $("<button/>", {
    id: "n",
    text: "Next Question"
  });
  var taBtn = $("<button/>", {
    id: "ta",
    text: "Try again"
  });
  var replayBtn = $("<button/>", {
    id: "rp",
    text: "Replay Answer"
  });
  divInModal.append([scoreText, afterburnerText, finalText, nextBtn, replayBtn,taBtn]);
  modal.append(divInModal);
  $("#brainDisplay").append(modal);
  //$("#brainDisplay").append("<div id='modal'><div><h2>Results: </h2><p>Correct: " + barTotal + "%</p>+<p>Distance Bonus:<br/> " + ab + "%</p><h2>Final Score: " + finalValue + "%</h2><button id='n'>Next Question</button><button id='rp'>Replay Answer</button><button id='ta'>Try Again</button>  </div></div>");

  //Function for replay answer button
  $("#rp").on("click", function(){
    $('#modal').remove();
    $(".picked img").attr("src", "images/BrainPointerSmall.svg");
    $(".checked").addClass("picked");
    $(".checked").removeClass("checked");
    state.pause = false;
    //state.submitted = true;
    playbackTheatre(state.currentRegion);
    $("#playbackControls").css("visibility", "visible");
    updateWidgets(state.totalLayers);
  });

  //Function for clicking next button
  $("#n").on("click", function(){
    cleanUpModal();
    state.currentQuestionNum++;
    updateLeaderBoard();
    resetQuestionState();
    updateButtons();
    unbindAll(false);
  });

  //Function for clicking try again buttonNextPlayer
  $("#ta").on("click", function(){
    $('#modal').remove();
    resetQuestionState();
    console.log("Pressed");
    loadCurrentQuestion();
    unbindAll(false);
  });

  $("#modal").css("font-size", "1.8rem");
  $("#rp, #ta, #n").css("pointerEvents", "auto");
  $("#modal button").css("font-size", "1.15rem");
  $(".questionSelectBtn").css("backgroundColor", "white");
  $("#questionSelect").css("pointerEvents", "inherit");
  //resizeWindow();
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
  }).done(function() {
    updateLeaderBoard();
  }).fail(function(d, textStatus, error) {
    console.error("getJSON failed, status: " + textStatus + ", error: " + error);
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




// Resize the window
function resizeWindow() {

  // Get window width and height
  $("#accordion").accordion("refresh");
  state.canvaswidthglobal = parseFloat($("#brainDisplay").css("width"));
  var   stageWidth = $(window).width();
  var stageHeight = $(window).height();
  // If the window aspect ratio >=  screen aspect, fix height and set width based on height
  var rotate = 0;
  // console.log($("#stage").css("background-image"));
  if ((stageWidth / stageHeight) >= state.aspectWidth / state.aspectHeight) {
    var lastWidth = stageWidth
    stageWidth = (state.aspectWidth / state.aspectHeight) * stageHeight;
    stageLeft = (lastWidth - stageWidth) / 2;
    stageTop = 0;


  }
  // If the window aspect ratio < than screen aspect, fix width and set height based on width
  else {
    var lastHeight = stageHeight
    stageHeight = (state.aspectHeight / state.aspectWidth) * stageWidth;
    stageTop = (lastHeight - stageHeight) / 2;
    stageLeft = 0;

  }
  // if ($("#stage").css("background-image").split("?").length>1) {
  //   stageLeft = 0;
  //   stageTop = 0;
  //   console.log("Portrait");
  //   console.log($("#stage").css("background-image"));
  //   rotate = 90;
  // }


  //  var plungerRange = 10/stageHeight;
  // currentPlungerSpeed

  // Set "screen" object width and height to stageWidth and stageHeight, and center screen
  $(".screen").css({
    width: stageWidth + "px",
    height: stageHeight + "px",
    left: stageLeft + "px",
    top: stageTop + "px",
    transform : "rotate(" +rotate +"deg)"
  });

  // Resize corner border radii based on stage height


  // var cornerSize = .025 * stageHeight;
  // $(".rounded").css({
  //   '-webkit-border-radius': cornerSize + "px",
  //   '-moz-border-radius': cornerSize + "px",
  //   'border-radius': cornerSize + "px"
  // });


  //Resize font-size for HTML type. Use rem measurement to set font-size
  $("html").css("font-size", (stageHeight / 60) + "px"); //updates bounds and areas when window is resized.

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
