import * as types from '../constants/ActionTypes';
const DEFAULT_LAYER = '1';
const initialState = {
  region: '',
  points: [],
  layer: DEFAULT_LAYER,
  markers: []
};

export function addMarkerToLayer(layer, markers, marker, maxPoints=Number.MAX_VALUE) {
  const layerIndex = layer - 1;
  var layerMarkers = markers[layerIndex] || [];
  layerMarkers[Math.min(layerMarkers.length, maxPoints - 1)] = marker
  const pad = [];
  const padLength = layerIndex - markers.length;
  if (padLength > 0) {
    pad[padLength - 1] = undefined;
  }
  var retData=[...markers.slice(0, layerIndex), ...pad, layerMarkers, ...markers.slice(layerIndex + 1)]
  console.log(retData)
  return retData;
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
      return Object.assign({}, state, {...action.question, layer: DEFAULT_LAYER, markers: []});
    case types.WHEEL_CHANGE:
      return Object.assign({}, state, {layer: action.layer});
    case types.CHANGE_LAYER:
      return Object.assign({}, state, {layer: action.layer});
    case types.ADD_MARKER:
      const marker = { position: action.position }
        return Object.assign({}, state, {markers: addMarkerToLayer(state.layer, state.markers, marker,state.pointsPerLayer)});
    case types.REMOVE_MARKER:
      return Object.assign({}, state, {markers: removeMarkerFromLayer(state.layer, state.markers, action.index)})
    case types.CLEAR_MARKERS:
      return Object.assign({}, state, {markers: []})
    default:
      return state;
    }
}
