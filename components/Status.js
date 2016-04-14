
export default ({actions, currentQuestion}) => {
	var result;

	var totalPoints=currentQuestion.requestLayers * currentQuestion.pointsPerLayer;
	var mark = currentQuestion.markers || [];
	var pointsPut =0 ;
	if(mark.length>0){
		pointsPut= (mark.map((h)=>{var accum=0;if(h) accum+=h.length;return accum;})).reduce( (prev, curr) => prev + curr );

	}


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
