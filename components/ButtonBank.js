import VisibleQuestionButton from './VisibleQuestionButton';
import SubmitBtn from '../components/SubmitBtn'
export default ({actions, questions}) => {

	return <div>
		{ questions.map((question, i) =>
			<VisibleQuestionButton key={i} question={question} questionNumber={i} />) }
			<SubmitBtn onClick={actions.submitAnswers} />


	</div>
};
