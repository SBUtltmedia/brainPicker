import {Colors, Button} from 'react-foundation';

export default ({question, isCurrentQuestion, showQuestion, questionNumber}) =>{
const buttonColor = isCurrentQuestion ? Colors.WARNING : Colors.ALERT;

 return (
	<Button color={buttonColor} onClick={showQuestion}>{questionNumber+1}</Button>
);
}
