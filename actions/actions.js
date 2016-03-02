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

export function putMarker(layer,position){

  return{
    type : types.ADD_MARKER,
    marker: {layer:layer, position: position},
    layer:layer

  }
}
