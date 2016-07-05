import { connect } from 'react-redux';
import {showQuestion} from '../actions/actions';
import QuestionButton from './QuestionButton';

const mapStateToProps = (state, ownProps) => {
  return {
		isCurrentQuestion: state.currentQuestion.questionNumber === ownProps.questionNumber
  };
}
const mapDispatchToProps = (dispatch, ownProps, state) => ({
	showQuestion: () => dispatch(showQuestion(ownProps.question))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionButton);
