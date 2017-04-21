import ReactSlider from 'react-slider';
import PointDisplayBank from './PointDisplayBank';

const styleRange = {

};

const LayerChanger = ({actions, layer, max }) => (
  <div>
    {/* <input style={styleRange} className="layerPicker" type="range" value={layer} min="1" max={max-1} orient="vertical" onChange={value => {actions.changeLayer(value.target.value)}}/> */}

    <PointDisplayBank min="1" max={max-1}/>
  </div>
)

export default LayerChanger
