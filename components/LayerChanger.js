import ReactSlider from 'react-slider';
import './LayerChanger.scss';

export default ({actions, currentQuestion}) => (
	<ReactSlider withBars min={0} max={20} value={currentQuestion.layer}
	orientation="vertical" onChange={value => actions.changeLayer(value)}>
		<div className="my-handle">1</div>
	</ReactSlider>
);
