import * as types from '../constants/ActionTypes';

const initialState=require('json!../data/questions.json');
export default function questions(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    }
}
