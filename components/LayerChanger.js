import ReactSlider from 'react-slider';
import './LayerChanger.scss';

const styleRange = {
	 WebkitAppearance: 'slider-vertical'
 };



export default ({actions, currentQuestion,layer,max }) => {

	return <div>
		<input style={styleRange} type="range" value={layer} min="1" max={max-1}
		orient="vertical" onChange={value => {actions.changeLayer(value.target.value)}}/>
	</div>

};
