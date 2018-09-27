//Represent the following variables as part of a state, rather than having globals..
var state = {
  which: "area medial and caudal to the green point",
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
  lastLayer: null,
  layerImages: null,
  pause: undefined,
  mytimeout: null,
  brainType: "human",
  previousQuestionScores: null,
  user: null,
  submitted: false,
  firstPause: true,
  questionScore: 0,
  playback: false
};

const sensitivity = 120;
const timeOutTime = 70;
const passScore = 70;
const screenMax = [480, 850];

$(function() {
  $("#title").html("Loading...");
  var dfd = jQuery.Deferred();
  getOrientationKeys();

  state.brainType = location.hash.split("#")[1] || state.brainType;
  var brainTypes = ["dolphin", "human"];
  state.brainType = state.brainType.toLowerCase();
  if (!(brainTypes.includes(state.brainType))) state.brainType = "human";
  getImageTotal(state.brainType + "/layerImages/", 1, dfd).then(function(data) {
    state.totalLayers = data;
    // preLoadImages().then(function(){


    console.log("^Don't worry about failed resource error, it's intentional^");
    //For mobile
    load().then(function() {
      //Mobile device detection
      if (($(window).width() < screenMax[0] && $(window).height() < screenMax[1]) || $(window).height() < screenMax[0]) {
        mobileSetup();
        mobileCSS();
        //only display blocker when device is in potrait mode.
        mobilePotraitBlocker(!($(window).height() < screenMax[0]));
      } else {
        $('#status').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(200).fadeOut('slow'); // will fade out the white DIV that covers the website.
      }
    });

    // });
  });
});

//preloads images to have them cached.
// function preLoadImages() {
//   var dfd = jQuery.Deferred();
//   var div= $("#brainImages");
//   loadPicture(1);
//   function loadPicture(layer) {
//     var virtualImg = $("<img/>",{
//       id: "pic_layer_"+layer,
//       class: "brainPic"
//     }).attr("src", state.brainType + "/layerImages/" + layer + ".jpg");
//     virtualImg.on("load", function(){
//       if (layer==state.totalLayers) {
//         div.append(virtualImg);
//         dfd.resolve();
//         return;
//       }
//       else {
//         div.append(virtualImg);
//         loadPicture(layer+1);
//       }
//     });
//     virtualImg.error(function(){
//       if (layer>=state.totalLayers) {
//         dfd.resolve();
//         return;
//       }
//       else {
//         loadPicture(layer);
//       }
//     });
//   }
//   return dfd;
// }

function mobileCSS() {
  $("#gridList").css("height", "65%");
  $("#gridList").css("padding-top", "1%");
  $("#gridList").css("padding-bottom", "1%");
}

function load() { // makes sure the whole site is loaded
  $('body').delay(350).css({
    'overflow': 'visible'
  });
  if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = (function() {

      return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

          window.setTimeout(callback, 1000 / 60);

        };

    })();

  }
  $("#Sagital").attr("src", state.brainType + "/Sagital.png");
  loadPlayerButtons();
  $("#accordion").accordion({
    heightStyle: "fill"
  });

  useLeaderBScroll(true);
  useMouseWheelLayers(true);
  updateScoreData();
  $.getJSON(state.brainType + "/distances.json", function(data) {
    state.maxDistances = data;
  });

  $.getJSON(state.brainType + "/structures.json", function(data) {
    state.globalPoly = data;



    $.getJSON(state.brainType + "/questionBank.json", function(data) {
      state.globalQuestion = data;
      loadCurrentQuestion()
      showQuestionButtons()
      updateButtons();
      //calculateAreas(state.globalPoly[state.which]);
      getBounds(state.maxDistances[state.which]);
      $(window).on("resize", function() {
        resizeWindow();
        drawMultiPoly();
        console.log("Resizing");
      });





      // output
    }); // input
  }); // input
  // compute
  return resizeWindow();
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

  console.log("updating leaderboard");
  updateScoreData().then(function() {
    $("#leaderB").html("");
    updateButtons();
    var question = state.which;
    if (state.globalQuestion[state.currentQuestionNum].text) {
      question = state.globalQuestion[state.currentQuestionNum].text; //if the region has an alt text, load the highscores from the text. otherwise, keep it via region.
    }


    if (state.leaderBoard) var questionLeaderB = state.leaderBoard[question]
    if (state.previousScores) state.previousQuestionScores = state.previousScores[question];

    $("#leaderB").css({
      "font-size": "1.3rem",
      "overflow": "auto"
    });
    $("#leaderB").html(" ");
    if (state.previousQuestionScores) {
      var userTotal = state.previousQuestionScores["score"] + state.previousQuestionScores["ab"];
      var table = $("<table/>").append($("<tbody/>"));
      var caption = $("<caption/>", {
        fontSize: "1.3rem",
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
        fontSize: "1.3rem",
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
    if ($("#playbackControls").css("visibility") == "visible") {
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
    $(window).trigger("resize"); //this ensures the accordion is displaying properly.
  });






  $("#restartToggle").click(function() {
    startJoyride();
  });

  for (i = 0; i < state.globalQuestion.length; i++) {

    toolTip = state.globalQuestion[i]["region"];
    if (state.globalQuestion[i]["text"]) {
      toolTip = state.globalQuestion[i]["text"];
    }

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
  $("#questionSelect").append($("<br/>"));
  var div = $("<div/>", {
    id: "correctLabels",
    width: "100%",
    height: "20%"
  });
  var table = $("<table/>", {
    width: "100%",
    height: "100%"
  });
  var tr = $("<tr/>", {
    width: "100%",
    height: "100%"
  });
  var boxPercentWidth = 100 / 5;
  tr.append($("<td/>", {
    width: boxPercentWidth + "%",
    style: "background-color: green"
  }));
  tr.append($("<td/>", {
    width: boxPercentWidth + "%",
    id: "numCorrect"
  }));
  tr.append($("<td/>", {
    width: boxPercentWidth + "%"
  }));

  tr.append($("<td/>", {
    width: boxPercentWidth + "%",
    style: "background-color: red"
  }));
  tr.append($("<td/>", {
    width: boxPercentWidth + "%",
    id: "numWrong"
  }));
  div.append(table.append(tr));
  $("#questionSelect").append(div);


  $(".questionSelectBtn").on("click", function(event) {
    state.currentQuestionNum = parseInt($(event.target).data('num'));
    updateScoreData();
    unbindAll(false);
    resetQuestionState();
    console.log(state.questionDistances);
    updateLeaderBoard();
    cleanUpModal();
    updateButtons();

  })

}


// function computeBounds(pointList) {
//   maxAvgDistance(pointList).then(function(){
//     var boxSize = [0, 0, 0];
//     var maxCoords = [0, 0, 0];
//     var minCoords = [1, 1, 1];
//     $.each(pointList, function(index, value) {
//       if (!value[0]) return true; //for some reason, the loop will iterate even if the value is empty and cause error. So, if no value, continue to next iteration.
//       for (i = 0; i < value[0].length; i += 2) {
//         var normX = value[0][i] / state.imageWidth;
//         var normY = value[0][i + 1] / state.imageWidth;
//         var normZ = index / state.totalLayers;
//         //console.log(normX, normY, normZ);
//
//         if (normX > maxCoords[0]) maxCoords[0] = normX;
//         if (normY > maxCoords[1]) maxCoords[1] = normY;
//         if (normZ > maxCoords[2]) maxCoords[2] = normZ;
//
//         if (normX < minCoords[0]) minCoords[0] = normX;
//         if (normY < minCoords[1]) minCoords[1] = normY;
//         if (normZ < minCoords[2]) minCoords[2] = normZ;
//
//         //console.log(maxCoords[0], maxCoords[1], maxCoords[2], minCoords[0], minCoords[1], minCoords[2]);
//
//         for (ee = 0; ee < 3; ee++) {
//           boxSize[ee] = maxCoords[ee] - minCoords[ee];
//         }
//
//
//
//       }
//
//     });
//
//   });
//
// }

// function maxAvgDistance(questionPointList) {
//   state.maxAvgDistances = [];
//   $.each(questionPointList, function(index,value) {
//     var allPoints = [];
//     //combines all points into a single list.
//     $.each(value,function(polygonNumber) {
//       allPoints = allPoints.concat(value[polygonNumber]);
//     });
//   });
//
// }

function getBounds(question) {
  state.questionDistances = {};
  $.each(question, function(index, value) {
    state.questionDistances[index] = value;
  })

}





//Calculates max possible distance for the question
function maxAvgDistance(questionPointList) {
  state.maxAvgDistances = [];
  $.each(questionPointList, function(index, value) {
    var max_dist = 0;
    var totalMaxDist = 0;
    var overallMaxDist = 0;
    var layerPoints = [];
    //combines all points into a single list.
    $.each(value, function(polygonNumber) {
      layerPoints = layerPoints.concat(value[polygonNumber]);
    });
    var oldPoint;
    var newPoint;
    var keptDivider = 0;
    if (!layerPoints) return true //returing true is continue for jQuery each statement
    for (i = 0; i < layerPoints.length; i += 2) {
      totalMaxDist = 0;
      divider = 0;
      var layerPointsTemp = layerPoints.slice();
      oldPoint = i;
      var x1 = layerPoints[i];
      var y1 = layerPoints[i + 1];
      for (l = 0; l < (state.totalReqPoints / state.requiredLayers) - 1; l++) {
        max_dist = 0;
        for (j = 0; j < layerPointsTemp.length - 2; j += 2) {
          //console.log("Checking Point ("+layerPoints[j]+","+layerPoints[j+1]+")");
          var x2 = layerPointsTemp[j];
          var y2 = layerPointsTemp[j + 1];
          if (x1 == x2 && y1 == y2) continue;
          var previous = max_dist;
          max_dist = Math.max(max_dist, Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
          if (max_dist != previous) {
            newPoint = j;
          }
        }
        x1 = layerPointsTemp[newPoint];
        y1 = layerPointsTemp[newPoint + 1];
        layerPointsTemp.splice(oldPoint, 2); //removes point.
        oldPoint = newPoint;
        totalMaxDist += max_dist;
        divider++;
      }
      if (overallMaxDist < totalMaxDist) {
        overallMaxDist = totalMaxDist;
        keptDivider = divider;
      }
    }
    state.maxAvgDistances[index] = (overallMaxDist / (keptDivider));
    //sets maxAverageDistance
  });
}

function zMaxDistance() { //caclulates maximum zDistance spread for each question.
  questionPointList = state.globalPoly[state.which];
  return Math.ceil(Object.keys(questionPointList).length / state.requiredLayers);
}

function setQuestionAreas(question) {
  state.questionAreas = [];
  $.each(question, function(index, value) {
    state.questionAreas[index] = value;
  });

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
//     var canvasArea = $("#stage").width()*.41 *$("#stage").height()*.73
//     console.log("A:"+canvasArea);
//     state.questionAreas[index] = 1-(total/canvasArea) //makes multiplier
//     console.log(state.questionAreas[index]);
//   });
//   dfd.resolve(newPoints);
//   return dfd;
// }

//Helper function for updateButtons that marks state of each question button.
function getUserHistory() {
  var questionColors = []
  var dfd = jQuery.Deferred();
  $.each(state.globalQuestion, function(key, value) {
    if (state.previousScores) {
      if (value.text) {
        var val = state.previousScores[value["text"]];
      }
      else {
        var val = state.previousScores[value["region"]];
      }

  }
    score = -1;
    if (val) score = val["score"] + val["ab"];
    questionColors.push(score);
  })
  dfd.resolve(questionColors);
  return dfd;
}

//Colors question buttons if based on status (answered, unanswered, current question)
function updateButtons() {
  getUserHistory().then(function(usrArr) {
    $(".questionSelectBtn").css("background-color", "white");
    var correct = 0;
    var wrong = 0;
    $(".questionSelectBtn").each(function(index, element) {
      if (index == state.currentQuestionNum) {
        $(this).css("background-color", "yellow")
        if (usrArr[index] >= passScore) { //if the user has a score greater than the passing score.
            correct++
        }
        else if (usrArr[index] < passScore && usrArr[index]>-1) { //if user had tried the question, and the score is less than the passing score.
          wrong++;
        }
      }
      else if (usrArr[index] >= passScore) {
        $(this).css("background-color", "green")
        correct++;
      }
      else if (usrArr[index] < 0) {
        $(this).css("background-color", "white");
      }
      else {
        $(this).css("background-color", "red");
        wrong++;
      }
      $("#numCorrect").html(" = "+correct);
      $("#numWrong").html(" = "+wrong);
    });
  });
}
//Self-explainatory
function resetQuestionState() {
  $('#modal').remove();
  $("#questionText").typed("reset");
  pausePicture(true);
  //state.submitted = false;

}

//loads the currently selected question
function loadCurrentQuestion() {

  updateButtons();

  $(".picked").remove();
  $(".joyride-content-wrapper").css("font-size", "1.2rem");
  $("#questionText").css("font-size", "1.5rem");
  //resizeWindow();.


  $("#gridTable").remove();
  //MasterOpacity
  state.drawOp = 0.5;
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
  var text= "";
  if (theQuestion.text) {
    text= theQuestion.text;
  }
  else {
    text = theQuestion.region;
  }
  var questionText = "Please pick " + theQuestion.pointsPerLayer + " points on " + theQuestion.requestLayers + " Layers in the <u>" + text + "</u><strong class='typed-cursor'> |</strong>";

  var textSize = 175/questionText.length; //makes new size according to length of text.

  state.requiredLayers = theQuestion.requestLayers;
  state.which = theQuestion.region;
  $("#title").html("Brain Picker " + state.brainType.capitalize() + " -" + state.which);
  getBounds(state.maxDistances[state.which]);
  state.currentRegion = "qn" + state.currentQuestionNum;
  updatePoints()
  $("#helpText").html("<p class='powerOn'>You have " + state.totalReqPoints + " points left to place, across " + state.requiredLayers + " more Layers </p>");
  $("#questionText").html("")
  $("#questionText").css("font-size", textSize+"rem") //sets text size according to text-length

  //if ( $("#questionText").   $("#questionText").removeData('typed');
  $("#questionText").typed({
    strings: [questionText],
    typeSpeed: 1,
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
  if (!state.playback) { //Updates help text based on layer
    state.pointsLayer = $('.' + state.currentLayer).length - 1;
    checkPointCount(state.currentRegion);
  }
  $(".pointerCell").css("backgroundImage", "none");
  $(".pointerCell").css("color", "black");
  $("#pointerCellrow_" + layer).css("backgroundImage", "url('images/LayerSelect2.png')");
  $("#pointerCellrow_" + layer).css("color", "black");
  //$("#sliderDiv").slider("value", layer);

  //$( "#sliderDiv" ).focus();
  updatePoints(layer);
  updateSagital(layer);


}
function scan(x1, y1, x2, y2) {
  var dfd = jQuery.Deferred();
  var area = 0;
  var totalPx = Math.abs(x2-x1)*Math.abs(y2-y1);
  console.log(totalPx);
  var loopPx=0;
  $('canvas').setPixels({
    x: x1,
    y: y1,
    width: x2,
    height: y2,
    each: function(px) {
      loopPx++;
      if (px.r != 0) area++;
      if (loopPx>=totalPx) {
        dfd.resolve(area);
      }
    }
  })
  return dfd;
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
  var boxPercentWidth = 100 / (columns + 2);
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
      style: "width:" + boxPercentWidth + "%",
      class: "pointerCell",
      html: n
    });
    if ($("#pointerCell" + currentRowId).length == 0) {
      $('#' + currentRowId).append(pointerCell);
    }






    for (m = 0; m < columns; m++) {

      currentGrid = $('#gridTable #box_' + n + "_" + m)

      if (!tableMade) {
        $('#' + currentRowId).append($("<td/>", {
          id: "box_" + n + "_" + m,
          style: "width:" + boxPercentWidth + "%",
          class: "sgridBox"
        }));
        if (m == columns - 1) {
          //extra row for numbers
          // $('#' + currentRowId).append($("<td/>", {
          //       id: "rowNumber_" + n,
          //       class: "rowNumber",
          //       style: "width:" + boxPercentWidth + "%",
          //       html:n
          //     }));
          $('#' + currentRowId).append($("<td/>", {
            id: "erase_" + n,
            class: "strobeBtn",
            style: "visibility: hidden",
            style: "width:" + boxPercentWidth + "%",
          }));
          $("#" + "erase_" + n).on("click", function() {
            $("." + this.id.split("_")[1]).remove();
            state.pointsLayer = -1;
            checkPointCount(state.currentRegion);
            drawGrid();

          })

$(window).on("keypress",evt=>{state.op=1-state.op})
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
  //$("#pic_layer_"+i).css("visibility", "visible");
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

function getPixelTotals(question) {
  $.each(question, function(index, value) {
    state.questionAreas[index] = value;
  });
}


function addToClickList(ex, ey, isCorrect) { // 2 calls from canvasClearing, drawPoly
  var fudgeX = 2.65;
  var fudgeY = 4.35;
  var w = parseFloat($("#stage").width());
  var h = parseFloat($("#stage").height());
  var percentX = ex / w * 100 + fudgeX;
  var percentY = ey / h * 100 + fudgeY;
  // console.log(percentX, percentY);
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
      isCorrect: isCorrect,
      class: state.currentLayer + " " + state.currentRegion + " pointerImage picked",
      id: idName
    }).on("click", function() {
      $(this).remove();
      state.pointsLayer = state.pointsLayer - 1;
      drawGrid();
      checkPointCount(state.currentRegion);
    }));
    $("#" + idName).css({
      position: "absolute",
      left: " " + percentX + "%",
      top: " " + percentY + "%"
    });
    $("#" + idName).append($("<img/>").attr("src", 'images/BrainPointerSmall.svg'));
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
  var pointPerLayer = cols - state.pointsLayer;

  $("#helpText").html("You have " + pointsLeft + " points left to place, across " + (state.requiredLayers - activeLayers()) + " more Layers");
  if (state.pointsLayer == -1) {} //Do nothing - effectively removes the help text;
  else if (pointPerLayer > 1) $("#helpText").append($("<p/>", {
    id: "helpLayer"
  }).html("You need " + (pointPerLayer - 1) + " points on this Layer."));
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
        state.drawOp = 0.4;
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
  var buttonPausePlayer = $("<img/>", {
    id: "buttonPausePlayer"
  });
  var buttonPrevPlayer = $("<img/>", {
    id: "buttonPrevPlayer"
  });
  var buttonNextPlayer = $("<img/>", {
    id: "buttonNextPlayer"
  });
  buttonPausePlayer.attr("src", "images/pause.png");
  //buttonPausePlayer.html("&#10074&#10074");
  buttonPrevPlayer.attr("src", "images/prev.png");
  buttonNextPlayer.attr("src", "images/next.png");

  buttonBank.append(buttonPrevPlayer);
  buttonBank.append(buttonPausePlayer);
  buttonBank.append(buttonNextPlayer);
  buttonBank.visibility = "hidden";
  $("#playbackControls").prepend(buttonBank);
  $("#playbackControls").css("visibility", "hidden");
  $("#buttonPrevPlayer").css("visibility", "hidden");
  $("#buttonNextPlayer").css("visibility", "hidden");



}
function pausePicture(status) {
  if (status)$("#buttonPausePlayer").attr("src", "images/play.png");
  else $("#buttonPausePlayer").attr("src", "images/pause.png");
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
  var playingLayer = false;
  $("#playbackControls").css("pointerEvents", "auto");
  $(".questionSelectBtn").css("filter", "grayScale(15)");
  $(".questionSelectBtn").css("pointerEvents", "none");
  $("#infoToggle").css("pointerEvents", "auto");
  $("#restartToggle").css("pointerEvents", "auto");
  //$("#buttonPausePlayer, #buttonNextPlayer,  #buttonPrevPlayer").off();

  $("#playbackControls").css("visibility", "visible");
  // document.getElementById("buttonPausePlayer").innerHTML = "&#10074&#10074";
  pausePicture(false);
  console.log("Loading playback theatre")
  var totalAfterBurnerScore = 0;
  var zScore = 0;
  pauseHandlers(true);
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
    max: 15,
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
    pausePicture(state.pause);
    if (state.pause == true) {
      if ($("#playbackControls").css("visibility") == "hidden") return;
      $("#buttonPrevPlayer").css("visibility", "visible");
      $("#buttonNextPlayer").css("visibility", "visible");
    } else {
      $("#buttonPrevPlayer").css("visibility", "hidden");
      $("#buttonNextPlayer").css("visibility", "hidden");
      if (!playingLayer) {//prevents stacking of playresult calls when pausing and advancing layers
        window.requestAnimationFrame(playResults);
      }
    }
  }
  function pauseHandlers(status) {
    $("buttonPrevPlayer, #buttonNextPlayer, #buttonPausePlayer").off();
    $("#restartToggle").off('click', function() {
        if (state.pause == false) {
          pausePlayback();
        }
      });
      $("#infoToggle").off('click', function() {
        if (state.pause == false) {
          pausePlayback();
        }
      });
      if (status) {
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
      }

  }




  var currentTime = 0;
  var oldTime = 0;
  function playResults() {
    currentTime = new Date().getTime();
    if (currentTime<oldTime+timeOutTime) { //timeoutTime is global const
      window.requestAnimationFrame(playResults);
      return;
    }
    else {
      oldTime = currentTime;
      playingLayer = true;
    }


    if (!state.playback) return;
    //Turned off so users cannot skip over layer while color points is still calculating.
    $("#buttonNextPlayer").off("click");
    $("#buttonPrevPlayer").off("click");
    if ($(".picked").length == 0 && state.currentLayer == 0) {


      $("#helpText").html("<h1>DONE</h1>");
      //console.log(totalAfterBurnerScore + "afterburnerscore");
      $(".checked").addClass("picked");
      state.currentLayer = state.totalLayers;
      state.lastLayer = null;
      //console.log("Afterburner: "+totalAfterBurnerScore);
      totalAfterBurnerScore /= state.requiredLayers;
      if (state.requiredLayers == 1 && totalAfterBurnerScore != 0) { //If there was only one layer for the question, automatically give a full score of 5 for zBonus if layer is correct.
        zScore = 5;
      } else if (state.requiredLayers > 1) { //prevents divide by zero error. User is automatically given 5 points if only 1 layer.
        zScore /= state.requiredLayers - 1;
      }
      if (totalAfterBurnerScore == 0) {
        var progressbar = $("#progressbar");
        var val = progressbar.progressbar("value") || 0;
        progressbar.progressbar("value", 0.1);
      }

      console.log(totalAfterBurnerScore,zScore,totalAfterBurnerScore+zScore);
      pauseHandlers(false);
      endModal(cs, totalAfterBurnerScore + zScore);
      burnBar((totalAfterBurnerScore + zScore)); //fills meter at rate in which 15% bonus is a full bar.
      state.playback = false;
      console.log("Playback ended");

    } else {

      var afterBurnerCount;

      //console.log("Help!");

      updateWidgets(state.currentLayer);
      if ($("." + state.currentLayer + ".picked").length == 0) {
        $("#buttonNextPlayer").on("click", function() {
          state.currentLayer--;
          playResults();
        });
        $("#buttonPrevPlayer").on("click", function() {
          updateWidgets(state.currentLayer + 1);
        });
        playingLayer = false;
        if (!state.pause) {
          state.currentLayer--;
          window.requestAnimationFrame(playResults);
          }


      } else {
        setTimeout(function() {
          colorPoints(state.currentLayer).then(
            function(val) {
              $("#buttonNextPlayer").on("click", function() {
                state.currentLayer--;
                playResults();
              });
              $("#buttonPrevPlayer").on("click", function() {
                updateWidgets(state.currentLayer + 1);
              });
              retValue = val;
              afterBurner(state.currentLayer).then(function(ab) {
                //Z Distance bonus is only given if all points on that layer are correct
                if (ab != 0) {
                  zScore += zBonus(state.currentLayer, state.lastLayer);
                  //console.log("Z: " + zScore);
                }
                state.lastLayer = state.currentLayer
                totalAfterBurnerScore += ab;
                playingLayer = false;
                if (!state.pause) {
                  window.requestAnimationFrame(playResults);
                }
              });



            }


          );
        }, timeOutTime * 5);
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
      if (currentPointNum >= points.length) {
        deferred.resolve(returnValue);
        return deferred
      };
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
  var timeOutBar = setInterval(function() {
    var val = progressbar.progressbar("value") || 0;
    if ((val < state.questionScore)) {
      progressbar.progressbar("value", val + .11);
    }
    if (state.playback == false && val >= state.questionScore) clearInterval(timeOutBar);
  }, timeOutTime);
  state.questionScore = 0.00;
}

function burnBar(c) {
  var burnerbar = $("#burnerbar");
  burnerbarValue = burnerbar.find(".ui-progressbar-value");
  var val = burnerbar.progressbar("value") || 0;
  var i = 0;
  var bar = setInterval(function() {
    i += .1;
    if (val + i > c) clearInterval(bar);
    burnerbar.progressbar("value", val + i);
  }, 15);
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



function zBonus(current, last) {
  if (!last) return 0; //if no previous layer exists
  max = zMaxDistance();
  if (zMaxDistance() > (last - current)) { //the reason it is last-current instead of vice versa is because the layer numbers descend, starting from the max layer number (bottom is 1);
    var zScore = 5 * (((last - current) / zMaxDistance()));
    return zScore;
  } else return 5; //otherwise return a full score.

}


//Afterburner steps

// 1) Calculate average distance between points chosen on this layer (according to scaleFactor)
// 2) Compare this (as a decimal percentage) to the max average distance (max distance/number of points -1)
// 3) Subtract from 1 to get percent accurate value (before subtracting it was percent inaccurate)
// 4) Multiply by ten to get percent out of 10.
function afterBurner(layer) {
  var dfd = jQuery.Deferred();
  var pointArray = $("." + layer + "[iscorrect='true']");
  if (pointArray.length<state.totalReqPoints/state.requiredLayers) {
    dfd.resolve(0);
    return dfd;
  }
  var dist = 0;
  var divider = pointArray.length*pointArray.length;
  for (i = 0; i < pointArray.length; i++) {
    var x1 = parseFloat($(pointArray[i]).css("left"));
    var y1 = parseFloat($(pointArray[i]).css("top"));
    for (j = 0; j < pointArray.length; j++) {
      var x2 = parseFloat($(pointArray[j]).css("left"));
      var y2 = parseFloat($(pointArray[j]).css("top"));
      dist+=Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
    }
  }
  dist=(dist/divider)*state.scaleFactor;
  var questionDistance = state.questionDistances[layer];
  if (dist>questionDistance) {
    returnScore = 10;
  }
  else {
  returnScore = 11-10*Math.abs((dist-questionDistance)/questionDistance); //use an eleven multiplier to make it easier to acheive the max distance bonus
  }
  returnScore = (returnScore > 10) ? 10.00 : returnScore;
  // console.log(returnScore);
  dfd.resolve(returnScore);
  return dfd;
}

function endModal(cs, ab) {
  state.pause = false;
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

  var scoreText = $("<h3/>", {id: "scoreText"}).html("Score:");
  var spreadText = $("<h3/>", {id: "spreadText"}).html("Spread Bonus:");
  var modal = $("<div/>", {
    id: "modal"
  });
  modal.append([scoreText,spreadText]);
  var divInModal = $("<div/>").append($("<h2/>").html("Results: "));
  var scoreText = $("<p/>").html("Correct: " + barTotal + "%");
  var afterburnerText = $("<p/>").html("Distance <br /> &nbsp;Bonus: <br/>" + ab + "%");
  var finalText = $("<h2/>").html("&nbsp;Final <br /> &nbsp;Score: <br />" + finalValue + "%");
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

  divInModal.append([scoreText, afterburnerText, finalText, nextBtn, replayBtn, taBtn]);
  modal.append(divInModal);
  $("#brainDisplay").append(modal);
  //$("#brainDisplay").append("<div id='modal'><div><h2>Results: </h2><p>Correct: " + barTotal + "%</p>+<p>Distance Bonus:<br/> " + ab + "%</p><h2>Final Score: " + finalValue + "%</h2><button id='n'>Next Question</button><button id='rp'>Replay Answer</button><button id='ta'>Try Again</button>  </div></div>");

  //Function for replay answer button
  $("#rp").on("click", function() {
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
  $("#n").on("click", function() {
    cleanUpModal();
    state.currentQuestionNum++;
    updateLeaderBoard();
    resetQuestionState();
    updateButtons();
    unbindAll(false);
  });

  //Function for clicking try again buttonNextPlayer
  $("#ta").on("click", function() {
    cleanUpModal();
    resetQuestionState();
    console.log("Trying again");
    loadCurrentQuestion();
    unbindAll(false);
  });

  $("#modal").css("font-size", "1.8rem");
  $("#rp, #ta, #n").css("pointerEvents", "auto");
  $("#modal button").css("font-size", "1.15rem");
  $(".questionSelectBtn").css("filter", "grayScale(0)");
  $("#questionSelect").css("pointerEvents", "inherit");
  //resizeWindow();
  //if (state.submitted == false) {
  var questionToSave = state.which;
  if (state.globalQuestion[state.currentQuestionNum].text) {
    questionToSave = state.globalQuestion[state.currentQuestionNum].text; //if the question has text, save as that instead.
  }
  $.ajax({
    type: "POST",
    url: "save.php",
    data: {
      "brain": state.brainType,
      "question": questionToSave,
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
  var dfd = jQuery.Deferred();
  // Get window width and height
  $("#accordion").accordion("refresh");
  state.canvaswidthglobal = parseFloat($("#brainDisplay").css("width"));
  var stageWidth = $(window).width();
  var stageHeight = $(window).height();
  //If mobile device
  if (stageWidth < screenMax[0] && stageHeight < screenMax[1]) {
    $("#preloader").html($("<h4/>", {
      "style": "font-Size : 10rem",
      "text": "Rotate to Resume"
    }));
    mobilePotraitBlocker(true);
  } else {
    $('#preloader').delay(200).fadeOut('slow'); //remove preloader
  }

  // If the window aspect ratio >=  screen aspect, fix height and set width based on height
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
  //Resize font-size for HTML type. Use rem measurement to set font-size
  $("html").css("font-size", (stageHeight / 60) + "px"); //updates bounds and areas when window is resized.

  //console.log($("#stage").css("background-image"));




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


  // var cornerSize = .025 * stageHeight;
  // $(".rounded").css({
  //   '-webkit-border-radius': cornerSize + "px",
  //   '-moz-border-radius': cornerSize + "px",
  //   'border-radius': cornerSize + "px"
  // });


  dfd.resolve();
  return dfd;

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
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
