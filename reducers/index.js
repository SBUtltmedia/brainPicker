import { combineReducers } from 'redux';
import structures from './structures';
import questions from './questions';
import images from './images';
import currentQuestion from './currentQuestion';

export default combineReducers({
  questions,
  structures,
  images,
  currentQuestion
});
