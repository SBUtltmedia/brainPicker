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



export default ({actions, currentQuestion,images, value}) => {
//console.log(max)
var localImages=images ||[];

  return (
  <div onWheel={e=>actions.wheelChangeLayer(currentQuestion.layer,e)}>

  <div style={regionStyle}>
    <Region actions={actions} currentQuestion={currentQuestion} images={images} />
  </div>
  <div style={changerStyle}>
    <LayerChanger layer={currentQuestion.layer} actions={actions} value={value} max={localImages.length} currentQuestion={currentQuestion} />
  </div>
  </div>)
}
