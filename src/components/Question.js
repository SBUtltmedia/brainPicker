
export default ({actions, questionText, pointsPerLayer, requestLayers, region}) => {
	var result;
	if(questionText == ""){
		result =  (<div>
						 Please pick {pointsPerLayer} points on {requestLayers} Layers in the <u>{region}</u>
						</div>);

	}else{
		result = (<div>{questionText}</div>);

	}

	return result;
 }
;
