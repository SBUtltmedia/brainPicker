import * as types from '../constants/ActionTypes';
const DEFAULT_LAYER = '1';
const initialState={
  region: '',
  points: [],
  layer: DEFAULT_LAYER,
  markers: []
};

function addMarkerToLayer(layer, markers, marker) {

  var retMarker=markers[layer]||[];
  retMarker=[...retMarker,marker];
var newMarkers= [...markers.slice(0,layer),retMarker,...markers.slice(layer+1)]
console.log("markers",JSON.stringify(newMarkers))

  return newMarkers
}

export default function currentQuestion(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return Object.assign({}, state, {...action.question, layer: DEFAULT_LAYER});
    case types.CHANGE_LAYER:
      return Object.assign({}, state, {layer: action.layer});
    case types.ADD_MARKER:
      return Object.assign({}, state, {markers: addMarkerToLayer(action.layer, state.markers, action.marker)});
    default:
      return state;
    }
}
