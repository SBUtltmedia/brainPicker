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


export function putMarker(layer, position) {

  var e = position.target;
  var dim = e.getBoundingClientRect();
  var x = ((position.clientX - dim.left)/dim.width)*500;
  var y = ((position.clientY- dim.top)/dim.height)*500 ;

  console.log(e+" "+dim.left+" "+dim.top+" "+x+" "+y+" "+layer);
  return{
    type : types.ADD_MARKER,
    marker: { layer:layer, position: [x, y] },
    layer:layer

  }
}

export function removeMarker(layer, index) {
  return {
    type: types.REMOVE_MARKER,
    layer: layer,
    index: index
  }
}
