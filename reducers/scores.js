import * as types from '../constants/ActionTypes';
const initialState = {

};

export default function scores(state = initialState, action) {
  switch (action.type) {
    case types.SUBMIT_ANSWERS:
      var questionScores = {};

      // TODO: Use question index and not entire question object?
      questionScores[action.question] = {
        correct: 0
      };

      return Object.assign({}, state, questionScores);
    default:
      return state;
  }
}
