import { combineReducers } from 'redux';
import structures from './structures';
import questions from './questions';
import currentQuestion from './currentQuestion';

export default combineReducers({
  questions,
  structures,
  currentQuestion
});
