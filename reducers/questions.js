import { LOAD_QUESTIONS } from '../constants/ActionTypes';

const initialState=[];
export default function questions(state = initialState, action) {
  switch (action.type) {
    case LOAD_QUESTIONS:
      return action.questions;
    default:
      return state;
    }
}
