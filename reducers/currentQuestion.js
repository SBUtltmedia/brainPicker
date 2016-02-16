import * as types from '../constants/ActionTypes';
const DEFAULT_LAYER = '1';
const initialState={
  region: '',
  points: [],
  layer: DEFAULT_LAYER
};
export default function structures(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return Object.assign({}, {layer: DEFAULT_LAYER}, action.question);
    case types.CHANGE_LAYER:
      return Object.assign({}, state, {layer: action.layer});
    default:
      return state;
    }
}
