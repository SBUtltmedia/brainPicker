import * as types from '../constants/ActionTypes';

var questionDots;

export function findQuestionDot() {

  return{
    type: types.LOAD_QUESTION_DOTS,
    questionDots : questionDots
  };
}

export function showQuestion(question) {
  return {
    type: types.SHOW_QUESTION,
    question: question
  };
}

export function submitAnswers() {
  return (dispatch, getState) => {
    const { images } = getState();
    const numLayers = images.length;
    var i = 1;
    const interval = setInterval(() => {
        dispatch(changeLayer(i));
        i += 1;
        if (i >= numLayers) {
          clearInterval(interval);
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

export function putMarker(position) {
  var e = position.target;
  var dim = e.getBoundingClientRect();
  var x = 500 * (position.clientX - dim.left) / dim.width;
  var y = 500 * (position.clientY- dim.top) / dim.height;
  return{
    type : types.ADD_MARKER,
    position: [x, y]
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
