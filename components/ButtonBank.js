import QuestionButton from './QuestionButton';
export default ({actions, buttons}) => (
	<div>
		{ buttons.map((question,i) =>
			<QuestionButton key={i}
			questionNumber={i}
			clickFunc={() => actions.showQuestion(question.region)} />) }
	</div>
);
