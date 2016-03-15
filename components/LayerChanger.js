import ReactSlider from 'react-slider';
import './LayerChanger.scss';

const styleRange = {
	 WebkitAppearance: 'slider-vertical'
 };

export default ({actions, currentQuestion,layer }) => (
	<div>
		<input style={styleRange} type="range" value={layer} min="1" max="21"
		orient="vertical" onChange={value => { console.log("VALUE",value.target.value); actions.changeLayer(value.target.value,0); }}/>
	</div>

);
