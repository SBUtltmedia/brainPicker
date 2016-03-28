import { combineReducers } from 'redux';
import currentQuestion from './currentQuestion';
import * as types from '../constants/ActionTypes';

const questions = require('json!../data/questions.json');
const structures = require('json!../data/structures.json');
const images = require('json!../data/images.json');

const initialState = {
  questions: questions,
  structures: structures,
  images: images,
  currentQuestion: currentQuestion(undefined, {
    type: types.SHOW_QUESTION,
    questionText: '',
    question: questions[0],
    points: structures[questions[0].region]
  })
};

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return Object.assign({}, state, {currentQuestion: currentQuestion(state.currentQuestion, {
        ...action,
        questionText: '',
        points: state.structures[action.question.region]
      })});
    case types.WHEEL_CHANGE:
      return Object.assign({}, state, {currentQuestion: currentQuestion(state.currentQuestion, {
        ...action,
        layer: Math.min(Math.max(1, action.layerDelta + state.currentQuestion.layer), state.images.length-1)
      })});
    case types.CHANGE_LAYER:
    case types.ADD_MARKER:
    case types.REMOVE_MARKER:
    case types.CLEAR_MARKERS:
      return Object.assign({}, state, {currentQuestion: currentQuestion(state.currentQuestion, action)});
    default:
      return state;
    }
}

/*
export default combineReducers({
  currentQuestion
});
*/
