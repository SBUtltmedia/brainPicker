import QuestionButton from './QuestionButton';
export default ({actions, questions, structures}) => {

	return <div>
		{ questions.map((question, i) =>
			<QuestionButton key={i} questionNumber={i} clickFunc={() => actions.showQuestion(question, structures)} />) }
	</div>
};
