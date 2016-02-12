import * as types from '../constants/ActionTypes';

const initialState=[];
export default function questions(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_QUESTIONS:
      return action.questions;
    default:
      return state;
    }
}
