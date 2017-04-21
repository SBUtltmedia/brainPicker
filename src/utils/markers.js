export function checkLeftLayers(markers, pointsPerLayer, layer) {
  const layerIndex = layer - 1;
	return markers[layerIndex] < pointsPerLayer
}

export function addMarkerToLayer(markers, layer, marker, maxPoints=Number.MAX_VALUE) {
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

export function removeMarkerFromLayer(markers, layer, index) {
  const layerIndex = layer - 1;
  var layerMarkers = markers[layerIndex] || [];
  layerMarkers = [...layerMarkers.slice(0, index),...layerMarkers.slice(index + 1)];
  return [...markers.slice(0, layerIndex), layerMarkers, ...markers.slice(layerIndex + 1)]
}

export function getMarkersInLayer(markers, layer) {
  return _.find(markers, m => m.layer === layer)
}
