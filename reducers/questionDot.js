import * as types from '../constants/ActionTypes';

const initialState=[];
export default function questionDot(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_QUESTION_DOTS:
      return action;
    default:
      return state;
    }
}
