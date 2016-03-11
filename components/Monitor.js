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



export default ({actions, currentQuestion}) => {
  const src = "data/images/catscan/"+(currentQuestion.layer)+".png";
  const points = currentQuestion.points[currentQuestion.layer] || [];
  const markers = currentQuestion.markers[currentQuestion.layer - 1] || [];
  return (
  <div onWheel={e=>actions.wheelChangeLayer(currentQuestion.layer,e)}>

  <div style={regionStyle}>
    <Region actions={actions} currentQuestion={currentQuestion} />
  </div>
  <div style={changerStyle}>
    <LayerChanger layer={currentQuestion.layer} actions={actions}  currentQuestion={currentQuestion} />
  </div>
  </div>)
}
