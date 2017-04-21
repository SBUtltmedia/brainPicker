import ReactDom  from 'react-dom';
import LayerChanger from '../components/LayerChanger';
import Region from '../components/Region';

const regionStyle = {
  width: "95%",
  float: "left"
};
const changerStyle = {
  width: "5%",
  height: "100%",
  float :"right",
  position : "absolute"
};

export default ({actions, images}) => (
  <div onWheel={e=>actions.wheelChangeLayer(e.deltaY)}>

  <div style={regionStyle}>
    <Region actions={actions} images={images} />
  </div>

  </div>
)
