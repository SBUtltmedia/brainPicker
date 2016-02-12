import ButtonObj from './Button';
export default ({actions, buttons}) => (
	<div>
		{ buttons.map((question,i) =>
			<ButtonObj id={i} key={i} clickFunc={() => actions.showQuestion(question.region)} />) }
	</div>
);
