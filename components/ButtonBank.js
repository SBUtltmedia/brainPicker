import QuestionButton from './QuestionButton';
import SubmitBtn from '../components/SubmitBtn'

export default ({actions, questions}) => {

	return <div>
		{ questions.map((question, i) =>
			<QuestionButton key={i} questionNumber={i} clickFunc={() => actions.showQuestion(question)} />) }

			<SubmitBtn onClick={actions.submitAnswers} />

	</div>
};
