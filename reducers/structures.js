import * as types from '../constants/ActionTypes';

const initialState=[];
export default function structures(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_STRUCTURES:
      return action.structures;
    default:
      return state;
    }
}
