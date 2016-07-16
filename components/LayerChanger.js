import ReactSlider from 'react-slider';
import './LayerChanger.scss';
import PointDisplayBank from './PointDisplayBank';
const styleRange = {

 };

export default ({actions, currentQuestion,layer,max }) => {

console.log(actions, currentQuestion,layer,max)

	return (<div>
		<input style={styleRange} className="layerPicker" type="range" value={layer} min="1" max={max-1} orient="vertical" onChange={value => {actions.changeLayer(value.target.value)}}/>

  <PointDisplayBank  min="1" max={max-1}/>
  </div>
)
};
