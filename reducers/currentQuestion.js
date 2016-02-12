import { SHOW_QUESTION } from '../constants/ActionTypes';

const initialState=[];
export default function structures(state = initialState, action) {
  switch (action.type) {
    case SHOW_QUESTION:
      return action.question;
    default:
      return state;
    }
}
