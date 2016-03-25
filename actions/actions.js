import * as types from '../constants/ActionTypes';
const questions = require('json!../data/question.json');
const structures = require ('json!../data/structure.json');

var questionDots  ;

export function loadQuestions() {

  questions.map((i,j)=>{if(i.questionDot){
                        questionDots=i.questionDot;
                        }
                      });

  return{
    type: types.LOAD_QUESTIONS,
    questions: questions
  };
}

export function findQuestionDot(){

  return{
    type: types.LOAD_QUESTION_DOTS,
    questionDots : questionDots
  };


}

export function loadStructures() {
  return {
    type: types.LOAD_STRUCTURES,

    regions: structures["region"],
    images     :  structures["images"]

  };
}

export function showQuestion(index) {

  return {
    type: types.SHOW_QUESTION,
    question: {
      questionText : "",
      ...questions[index],
      points: structures["region"][questions[index].region]
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
  //var localImages=struc ||[];
  newLayer = Math.min(Math.max(1,newLayer),structures["images"].length-1);
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
