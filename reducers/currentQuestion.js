import * as types from '../constants/ActionTypes';

const initialState={
  region: '',
  points: [],
  layer: '1'
};
export default function structures(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return Object.assign({}, {layer: state.layer}, action.question);
    case types.CHANGE_LAYER:
      return Object.assign({}, state, {layer: action.layer});
    default:
      return state;
    }
}
