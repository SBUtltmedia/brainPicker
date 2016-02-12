import { LOAD_STRUCTURES } from '../constants/ActionTypes';

const initialState=[];
export default function structures(state = initialState, action) {
  switch (action.type) {
    case LOAD_STRUCTURES:
      return action.structures;
    default:
      return state;
    }
}
