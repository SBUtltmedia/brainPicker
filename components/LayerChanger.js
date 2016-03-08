import ReactSlider from 'react-slider';
import './LayerChanger.scss';

export default ({actions, currentQuestion}) => (
	<ReactSlider withBars min={1} max={21} orientation="vertical" onChange={value => actions.changeLayer(value)}>
		<div className="my-handle">1</div>
	</ReactSlider>
);
