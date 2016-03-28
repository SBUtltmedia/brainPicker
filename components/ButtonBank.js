import QuestionButton from './QuestionButton';
export default ({actions, questions}) => {

	return <div>
		{ questions.map((question, i) =>
			<QuestionButton key={i} questionNumber={i} clickFunc={() => actions.showQuestion(question)} />) }
	</div>
};
