import { combineReducers } from 'redux';
import currentQuestion from './currentQuestion';
import scores from './scores';
import * as types from '../constants/ActionTypes';

const questions = require('json!../data/questions.json');
const structures = require('json!../data/structures.json');
const images = require('json!../data/images.json');
const existingScores = {}; //require('json!https://apps.tlt.stonybrook.edu/brainPicker/getScores.php?...')

const initialState = {
  questions: questions,
  structures: structures,
  images: images,
  currentQuestion: currentQuestion(undefined, {
    type: types.SHOW_QUESTION,
    questionText: '',
    question: questions[0],
    points: structures[questions[0].region]
  }),
  scores: scores(undefined, existingScores)
};

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return Object.assign({}, state, {currentQuestion: currentQuestion(state.currentQuestion, {
        ...action,
        points: state.structures[action.question.region]
      })});
    case types.WHEEL_CHANGE:
      return Object.assign({}, state, {currentQuestion: currentQuestion(state.currentQuestion, {
        ...action,
        layer: Math.min(Math.max(1, action.layerDelta + state.currentQuestion.layer), state.images.length - 1)
      })});
    case types.SUBMIT_ANSWERS:
      return Object.assign({}, state, {
        scores: scores(state.scores, { ...action, question: state.currentQuestion }),
        currentQuestion: currentQuestion(state.currentQuestion, action)
      });
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
