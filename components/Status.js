
export default ({actions, currentQuestion}) => {
	console.log(currentQuestion.markers,currentQuestion.layer);
	var result;

	var totalPoints=currentQuestion.requestLayers * currentQuestion.pointsPerLayer;
try
	{var pointsPut= (currentQuestion.markers.map((h)=>{var accum=0;if(h) accum+=h.length;return accum;})||[0,0]).reduce( (prev, curr) => prev + curr );
}catch(e){ var pointsPut=0; }

var layerMarkersLeft = currentQuestion.markers[currentQuestion.layer-1]? currentQuestion.markers[currentQuestion.layer-1].length : 0;
var currLayerText=`and ${layerMarkersLeft} on this layer`;
console.log(layerMarkersLeft);

/*
var  layerMarkersLeft=0;
if(currentQuestion.markers.length>currentQuestion.layer)
layerMarkersLeft= currentQuestion.pointsPerLayer-currentQuestion.markers[currentQuestion.layer-1].length;
if (layerMarkersLeft!=currentQuestion.pointsPerLayer){
 currLayerText =`and ${currentQuestion.markers[currentQuestion.layer-1].length} on this layer`;
}
*/
	if(currentQuestion.questionText == ""){
		result =  (<div>
						You have {totalPoints-pointsPut} points left on this layer, <u>{currentQuestion.region}</u>, {currLayerText}
						</div>);

	}else{
		result = (<div>{currentQuestion.questionText}</div>);

	}

	return result;
 }
;
