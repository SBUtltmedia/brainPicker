
export default ({actions, currentQuestion}) => {

	console.log("CURTEXT",currentQuestion.questionText);
	console.log("REGION",currentQuestion.region);
	var result;
	if(currentQuestion.questionText == ""){
		result =  (<div>
						 Please pick {currentQuestion.pointsPerLayer} points on {currentQuestion.requestLayers} Layers in the <u>{currentQuestion.region}</u>
						</div>);

	}else{
		result = (<div>{currentQuestion.questionText}</div>);

	}

	return result;
 }
;
