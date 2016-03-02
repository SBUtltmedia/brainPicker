import * as types from '../constants/ActionTypes';
const DEFAULT_LAYER = '1';
const initialState = {
  region: '',
  points: [],
  layer: DEFAULT_LAYER,
  markers: []
};

export function addMarkerToLayer(layer, markers, marker) {
  const layerIndex = layer - 1;
  var layerMarkers = markers[layerIndex] || [];
  layerMarkers = [...layerMarkers, marker];
  const pad = [];
  const padLength = layerIndex - markers.length;
  if (padLength > 0) {
    pad[padLength - 1] = undefined;
  }
  return [...markers.slice(0, layerIndex), ...pad, layerMarkers, ...markers.slice(layerIndex + 1)]
}

export function removeMarkerFromLayer(layer, markers, index) {
  const layerIndex = layer - 1;
  var layerMarkers = markers[layerIndex] || [];
  layerMarkers = [...layerMarkers.slice(0, index),...layerMarkers.slice(index + 1)];
  return [...markers.slice(0, layerIndex), layerMarkers, ...markers.slice(layerIndex + 1)]
}

export default function currentQuestion(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_QUESTION:
      return Object.assign({}, state, {...action.question, layer: DEFAULT_LAYER});
    case types.CHANGE_LAYER:
      return Object.assign({}, state, {layer: action.layer});
    case types.ADD_MARKER:
      const marker = { position: action.position }
      return Object.assign({}, state, {markers: addMarkerToLayer(state.layer, state.markers, marker)});
    case types.REMOVE_MARKER:
      return Object.assign({}, state, {markers: removeMarkerFromLayer(action.layer, state.markers, action.index)})
    default:
      return state;
    }
}
