
import Marker from '../components/Marker';

const styleSVG = {
   fill: 'blue',
   stroke: "green",
   fillOpacity: 0.5,
   strokeOpacity: 0.5,
   strokeWidth: "10px",
   margin : 0 ,
   padding: 0,
   width:'100%',
   height : '100%',

 };

export default ({actions, currentQuestion}) => {
  const src = "data/images/catscan/"+(currentQuestion.layer)+".png";
  const points = currentQuestion.points[currentQuestion.layer] || [];
  const markers = currentQuestion.markers[currentQuestion.layer - 1] || [];
  return <div>
    <svg id="brainImage" xmlns="http://www.w3.org/2000/svg" style={styleSVG} viewBox="0 0 500 500" >
      <image x="0" y="0" width="100%" height="100%" xlinkHref={src} onClick={actions.putMarker}/>

      {points.map((contiguousPoints, i) =>
        <polygon key={i} onClick={() => console.log('hit')} points={contiguousPoints}/>)}

      {markers.map((marker, i) =>
        <Marker color={"#93268f"} position={marker.position} key={i} onClick={() => actions.removeMarker(i)} />)}
    </svg>
  </div>;
}
