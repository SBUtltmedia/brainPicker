import {Colors, Button, Sizes} from 'react-foundation';
import { connect } from 'react-redux';
import {showQuestion} from '../actions/actions';


const mapStateToProps = (state, ownProps) => {
  return {
		isCurrentQuestion: state.questionNumber === ownProps.questionNumber
  };
}
const mapDispatchToProps = (dispatch, ownProps, state) => ({
	showQuestion: () => dispatch(showQuestion(ownProps.question))
});


const QuestionButton = ({question, isCurrentQuestion, showQuestion, questionNumber}) =>{
const buttonColor = isCurrentQuestion ? Colors.WARNING : Colors.ALERT;

 return (
	<Button size={Sizes.SMALL} color={buttonColor} onClick={showQuestion}>{questionNumber+1}</Button>
);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionButton);
