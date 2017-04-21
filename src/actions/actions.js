import * as types from '../constants/ActionTypes';

export function showQuestion(index) {
  return {
    type: types.SHOW_QUESTION,
    questionIndex: index
  };
}

export function submitAnswers() {
  return (dispatch, getState) => {
    const { images, requestLayers, pointsPerLayer, markers } = getState();
    const numLayers = images.length;
    const totalPoint = requestLayers * pointsPerLayer;
    var corPoint =0;
    console.log(totalPoint);
    var i = 1;
    const interval = setInterval(() => {
        dispatch(changeLayer(i));
        if(markers[i-1]){
          for(var j=0;j<markers[i-1].length;j++){
            if(markers[i-1][j].isHit==true){
              //Add corrected Points
              corPoint++;
            }
          }
        }
        i += 1;
        if (i >= numLayers) {
          clearInterval(interval);
          const percetPoi = corPoint/ totalPoint*100;
          console.log("CORRECT POINT",corPoint);
          console.log("CORRECT PER",percetPoi.toPrecision(3));
          dispatch({
            type: types.SUBMIT_ANSWERS
          });
        }
    }, 300);
  };
}

export function changeLayer(layer) {
  return {
    type: types.CHANGE_LAYER,
    layer: parseInt(layer)
  }
}

export function wheelChangeLayer(deltaY) {
  return {
    type: types.WHEEL_CHANGE,
    layerDelta: parseInt(deltaY / 10)
  }
}

export function putMarker(isHit) {
  var dim = document.getElementById("brainImage").getBoundingClientRect();
  var x = 500 * (e.clientX - dim.left) / dim.width;
  var y = 500 * (e.clientY- dim.top) / dim.height;
  return{
    type : types.ADD_MARKER,
    position: [x, y],
    isHit: isHit
  }
}

export function removeMarker(index) {
  return {
    type: types.REMOVE_MARKER,
    index: index
  }
}

export function clearMarkers() {
  return {
    type: types.CLEAR_MARKERS
  }
}
