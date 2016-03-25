import QuestionButton from './QuestionButton';
export default ({actions, buttons}) => {

	return <div>
		{ buttons.map((question, i) =>
			<QuestionButton key={i} questionNumber={i} clickFunc={() => actions.showQuestion(i)} />) }
	</div>
};
