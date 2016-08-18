import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';
const questionsData = require('json!../data/questions.json');
const questions=questionsData.map((theQuestion,i)=>({...theQuestion, questionNumber:i}))
const structures = require('json!../data/structures.json');
const images = require('json!../data/images.json');
const existingScores = {}; //require('json!https://apps.tlt.stonybrook.edu/brainPicker/getScores.php?...')

const DEFAULT_LAYER = 1;


const initialState = {
  questions: questions,
  structures: structures,
  images: images,
  question: questions[0],
  requestLayers : questions[0].requestLayers,
  pointsPerLayer : questions[0].pointsPerLayer,
  questionText : questions[0].questionText,
  questionScores: {},

  leftLayers : 0,  // TODO: Keep one
  layersLeft:0,

  region: questions[0].region,
  points: structures[questions[0].region],
  layer: DEFAULT_LAYER,
  markers: [],
  questionDot: questions[0].questionDot,
};

export function checkLeftLayers(pointLayer,RequestLayer,markers){
	var mark = markers || [];
  var layerUsed =0 ;
  console.log("MARK_DATA",mark);
  console.log("MARK_LENGTH",mark.length);
	if(mark.length>0){
		layerUsed= (mark.map((h)=>{var accum=0;if(h && h.length>0)accum++;return accum;})).reduce( (prev, curr) => prev + curr );

	}
  if(layerUsed <=RequestLayer) {
    return true;
  }
  else return false;
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
      return {...state, ...action.question, markers: [], layer: 0,  // TODO: Should this sometimes be a different layer?
        points: state.structures[action.question.region], leftPoints : [state.pointsPerLayer], leftLayers : 0};
    case types.WHEEL_CHANGE:
      return {...state, layer: Math.min(Math.max(1, action.layerDelta + state.layer), state.images.length - 1)};
    case types.SUBMIT_ANSWERS:
      return {...state, questionScores: [...state.questionScores.slice(0, action.question), 0, ...state.questionScores.slice(action.question + 1)]};
    case types.CHANGE_LAYER:
      return {...state, layer: action.layer};
    case types.ADD_MARKER:
      var marker = {position: action.position, isHit: action.isHit};
      var markers = addMarkerToLayer(state.layer, state.markers, marker, state.pointsPerLayer);
      var maxLayer = checkLeftLayers(state.pointsPerLayer, state.requestLayers,markers);
      console.log("MAxLayer",maxLayer)
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
