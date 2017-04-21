import {Colors, Button, Sizes} from 'react-foundation';
import {connect} from 'react-redux';
import {showQuestion} from '../actions/actions';

const ButtonBank = ({questions, current, showQuestion}) => (
	<div>
		{questions.map((question, i) => (
			<Button size={Sizes.SMALL}
						  color={current === i ? Colors.WARNING : Colors.ALERT}
							onClick={() => showQuestion(i)}
							key={i}
			>
				{i + 1}
			</Button>
		))}
	</div>
)

const mapStateToProps = (state) => ({
	questions: state.questions,
	current: state.questionNumber
})

export default connect(
  mapStateToProps,
  {showQuestion}
)(ButtonBank);
