import * as types from '../constants/ActionTypes';
const questions = require('json!../data/question.json');
const structures = require ('json!../data/structure.json');

export function loadQuestions() {
  return {
    type: types.LOAD_QUESTIONS,
    questions: questions
  };
}

export function loadStructures() {
  return {
    type: types.LOAD_STRUCTURES,
    structures: structures
  };
}

export function showQuestion(index) {
  return {
    type: types.SHOW_QUESTION,
    question: {
      ...questions[index],
      points: structures[questions[index].region]
    }
  };
}


export function changeLayer(layer) {

  return {
    type: types.CHANGE_LAYER,
    layer: layer
  }
}


export function wheelChangeLayer(layer,e) {
var newLayer= parseInt(e.deltaY/10+layer);

newLayer = Math.min(Math.max(1,newLayer),21);
return {
  type: types.WHEEL_CHANGE,
  layer: newLayer
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
