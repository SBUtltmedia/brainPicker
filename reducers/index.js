import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';
const questionsData = require('../data/questions.json');
const questions=questionsData.map((theQuestion,i)=>({...theQuestion, questionNumber:i}))
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

export function checkLeftLayers(pointsPerLayer, layer, markers) {
  const layerIndex = layer - 1;
	return markers[layerIndex] < pointsPerLayer
}

export function addMarkerToLayer(layer, markers, marker, maxPoints=Number.MAX_VALUE) {
  const layerIndex = layer - 1;
  var layerMarkers = markers[layerIndex] || [];
  layerMarkers[Math.min(layerMarkers.length, maxPoints - 1)] = marker
  const pad = [];
  const padLength = layerIndex - markers.length;
  if (padLength > 0) {
    pad[padLength - 1] = undefined;
  }
  return [...markers.slice(0, layerIndex), ...pad, layerMarkers, ...markers.slice(layerIndex + 1)]
}

export function removeMarkerFromLayer(layer, markers, index) {
  const layerIndex = layer - 1;
  var layerMarkers = markers[layerIndex] || [];
  layerMarkers = [...layerMarkers.slice(0, index),...layerMarkers.slice(index + 1)];
  return [...markers.slice(0, layerIndex), layerMarkers, ...markers.slice(layerIndex + 1)]
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
      const currentQuestion = getCurrentQuestion(state)
      var marker = {position: action.position, isHit: action.isHit};
      var markers = addMarkerToLayer(state.layer, state.markers, marker, currentQuestion.pointsPerLayer);
      var maxLayer = checkLeftLayers(currentQuestion.pointsPerLayer, state.layer, markers);
      console.log("MAxLayer", maxLayer)
      if (maxLayer){
        return {...state, markers: markers};
      }
    case types.REMOVE_MARKER:
      return {...state, markers: removeMarkerFromLayer(state.layer, state.markers, action.index)};
    case types.CLEAR_MARKERS:
      return {...state, markers: []};
    default:
      return state;
    }
}
