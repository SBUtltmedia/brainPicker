import { combineReducers } from 'redux';
import * as markerUtils from '../utils/markers';
import * as types from '../constants/ActionTypes';
import questionsData from 'data/questions.json';
import structures from 'data/structures.json';
import images from 'data/images.json';

const DEFAULT_LAYER = 1;
const questions = questionsData.map((q, i) => ({...q, questionNumber: i}))

const initialState = {
  questions,
  structures,
  images,
  currentQuestionIndex: 0,
  questionScores: {},
  layer: DEFAULT_LAYER,
  markers: {},
  questionDot: questions[0].questionDot,
};

function getCurrentQuestion(state) {
  return state.questions[state.currentQuestionIndex]
}

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return {...state, currentQuestionIndex: action.questionIndex, markers: [], layer: 0}  // TODO: Should this sometimes be a different layer?
    case types.WHEEL_CHANGE:
      return {...state, layer: Math.min(Math.max(1, action.layerDelta + state.layer), state.images.length - 1)};
    case types.SUBMIT_ANSWERS:
      return {...state, questionScores: [...state.questionScores.slice(0, action.question), 0, ...state.questionScores.slice(action.question + 1)]};
    case types.CHANGE_LAYER:
      return {...state, layer: action.layer};
    case types.ADD_MARKER:
      const currentQuestion = getCurrentQuestion(state)
      var marker = {position: action.position, isHit: action.isHit};
      var markers = markerUtils.addMarkerToLayer(state.markers, state.layer, marker, currentQuestion.pointsPerLayer);
      var maxLayer = markerUtils.checkLeftLayers(state.markers, currentQuestion.pointsPerLayer, state.layer);
      console.log("MAxLayer", maxLayer)
      if (maxLayer){
        return {...state, markers};
      }
    case types.REMOVE_MARKER:
      return {...state, markers: markerUtils.removeMarkerFromLayer(state.markers, state.layer, action.index)};
    case types.CLEAR_MARKERS:
      return {...state, markers: []};
    default:
      return state;
    }
}
