import { combineReducers } from 'redux';
import * as markers from '../utils/markers.js'
import * as types from '../constants/ActionTypes';
const questionsData = require('../data/questions.json');
const questions = questionsData.map((theQuestion,i) => ({...theQuestion, questionNumber:i}))
const structures = require('../data/structures.json');
const images = require('../data/images.json');
const existingScores = {}; //require('https://apps.tlt.stonybrook.edu/brainPicker/getScores.php?...')

const DEFAULT_LAYER = 1;

const initialState = {
  questions,
  structures,
  images,
  currentQuestionIndex: 0,
  questionScores: {},
  layer: DEFAULT_LAYER,
  markers: [],
  questionDot: questions[0].questionDot,
};

function getCurrentQuestion(state) {
  return state.questions[state.currentQuestionIndex]
}

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return {...state, currentQuestionIndex: action.questionIndex, markers: [], layer: 0,  // TODO: Should this sometimes be a different layer?
        points: state.structures[action.question.region]};
    case types.WHEEL_CHANGE:
      return {...state, layer: Math.min(Math.max(1, action.layerDelta + state.layer), state.images.length - 1)};
    case types.SUBMIT_ANSWERS:
      return {...state, questionScores: [...state.questionScores.slice(0, action.question), 0, ...state.questionScores.slice(action.question + 1)]};
    case types.CHANGE_LAYER:
      return {...state, layer: action.layer};
    case types.ADD_MARKER:
      const currentQuestion = markers.getCurrentQuestion(state)
      var marker = {position: action.position, isHit: action.isHit};
      var markers = markers.addMarkerToLayer(state.layer, state.markers, marker, currentQuestion.pointsPerLayer);
      var maxLayer = markers.checkLeftLayers(currentQuestion.pointsPerLayer, state.layer, markers);
      console.log("MAxLayer", maxLayer)
      if (maxLayer){
        return {...state, markers: markers};
      }
    case types.REMOVE_MARKER:
      return {...state, markers: markers.removeMarkerFromLayer(state.layer, state.markers, action.index)};
    case types.CLEAR_MARKERS:
      return {...state, markers: []};
    default:
      return state;
    }
}
