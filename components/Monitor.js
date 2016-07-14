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



export default ({actions, currentQuestion, images}) => {

  return (
  <div onWheel={e=>actions.wheelChangeLayer(e.deltaY)}>

  <div style={regionStyle}>
    <Region actions={actions} currentQuestion={currentQuestion} images={images} />
  </div>

  </div>)
}
