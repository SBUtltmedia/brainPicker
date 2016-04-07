
export default ({actions, currentQuestion}) => {
	var result;
	if(currentQuestion.questionText == ""){
		result =  (<div>
						 Please pick {currentQuestion.leftPoints} points on {currentQuestion.requestLayers} Layers in the <u>{currentQuestion.region}</u>
						</div>);

	}else{
		result = (<div>{currentQuestion.questionText}</div>);

	}

	return result;
 }
;
