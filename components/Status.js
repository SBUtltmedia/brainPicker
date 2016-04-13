
export default ({actions, currentQuestion}) => {
	var result;

	var totalPoints=currentQuestion.requestLayers * currentQuestion.pointsPerLayer;
try
	{var pointsPut= (currentQuestion.markers.map((h)=>{var accum=0;if(h) accum+=h.length;return accum;})||[0,0]).reduce( (prev, curr) => prev + curr );
}catch(e){ var pointsPut=0; }

var layerMarkersLeft = currentQuestion.markers[currentQuestion.layer-1]? currentQuestion.markers[currentQuestion.layer-1].length : 0;
var currLayerText=`and there are ${layerMarkersLeft} marker(s) on this layer`;

/*
var  layerMarkersLeft=0;
if(currentQuestion.markers.length>currentQuestion.layer)
layerMarkersLeft= currentQuestion.pointsPerLayer-currentQuestion.markers[currentQuestion.layer-1].length;
if (layerMarkersLeft!=currentQuestion.pointsPerLayer){
 currLayerText =`and ${currentQuestion.markers[currentQuestion.layer-1].length} on this layer`;
}
*/
	return (<div>
					You have {totalPoints-pointsPut} point(s) left and {} layers left, {currLayerText}
					</div>);

 }
;
