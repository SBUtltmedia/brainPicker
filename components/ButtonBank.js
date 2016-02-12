import ButtonObj from './Button';
export default ({buttons}) => (
	<div>
		{ buttons.map((d,i) =>
			<ButtonObj id={i} key={i} clickFunc={i => console.log(d.region)} />) }
	</div>
);
