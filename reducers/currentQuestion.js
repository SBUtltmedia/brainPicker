import * as types from '../constants/ActionTypes';
const DEFAULT_LAYER = 1;
const initialState = {
  requestLayers : '',
  pointsPerLayer : '',
  questionText : '',
  region: '',
  points: [],
  leftLayers : [],
  layer: DEFAULT_LAYER,
  markers: [],
  questionDot: null
};

export function checkLeftLayers(layer,markers,leftLayers,requestLayers){

  leftLayers.forEach((el)=>{

    if(layer == el){
      return leftLayers;
    }else{
        if(leftLayers.length == requestLayers)
          return false;

        

    }


  });


  return leftLayers+1;

}

export function addMarkerToLayer(layer, markers, marker, maxPoints=Number.MAX_VALUE) {
  const layerIndex = layer - 1;
  var layerMarkers = markers[layerIndex] || [];
  layerMarkers[Math.min(layerMarkers.length, maxPoints - 1)] = marker
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
      const layer = action.question.questionDot ? action.question.questionDot.layers[0] : DEFAULT_LAYER;
    //  const newLeftpoints[state.layer] =
      return Object.assign({}, state, {questionText:'', ...action.question, markers: [], layer: layer, points: action.points, leftPoints : [state.pointsPerLayer], leftLayers : Array(state.requestLayers)});
    case types.WHEEL_CHANGE:
      return Object.assign({}, state, {layer: action.layer});
    case types.CHANGE_LAYER:
      return Object.assign({}, state, {layer: action.layer});
    case types.ADD_MARKER:

      var newLeftLayers = checkLeftLayers(state.layer,state.markers,state.leftLayers);
      var marker = { position: action.position, isHit: action.isHit };
      marker =  addMarkerToLayer(state.layer, state.markers, marker,state.pointsPerLayer);

      console.log("newLeftLAYERS",newLeftLayers);

      if(newLeftLayers <= state.requestLayers){
        return Object.assign({}, state, {markers: marker, leftLayers : newLeftLayers});
      }

    case types.REMOVE_MARKER:
      return Object.assign({}, state, {markers: removeMarkerFromLayer(state.layer, state.markers, action.index)})
    case types.CLEAR_MARKERS:
      return Object.assign({}, state, {markers: []})
    case types.SUBMIT_ANSWERS:
      return state;  // TODO: Implement
    default:
      return state;
    }
}
