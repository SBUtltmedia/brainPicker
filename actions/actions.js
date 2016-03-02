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

export function showQuestion(question) {
  return {
    type: types.SHOW_QUESTION,
    question: {
      region: question,
      points: structures[question]
    }
  };
}

export function changeLayer(layer) {
  return {
    type: types.CHANGE_LAYER,
    layer: layer
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

export function removeMarker(layer, index) {
  return {
    type: types.REMOVE_MARKER,
    layer: layer,
    index: index
  }
}
