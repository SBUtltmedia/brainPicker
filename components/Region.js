import { connect } from 'react-redux';
import Marker from '../components/Marker';
import QuestionDot from '../components/QuestionDot';
import {removeMarker} from '../actions/actions';
import _ from 'lodash';

const styleSVG = {
   fill: 'blue',
   //stroke: "green",
   fillOpacity: 0.5,
   strokeOpacity: 0.5,
   //strokeWidth: "10px",
   margin : 0 ,
   padding: 0,
   width:'100%',
   height : '100%'
 };

 const mapStateToProps = (state, ownProps) => {
   return {
     isCurrentQuestion: state.questionNumber === ownProps.questionNumber,
     layer: state.layer,
     layerPoints: state.points[(state.layer + 1).toString()] || [],
     layerMarkers: state.markers[state.layer - 1] || [],
     questionDot: state.questionDot,
   };
 }
 const mapDispatchToProps = dispatch => ({
 	rmMarker: index => dispatch(removeMarker(index))
 });

const Region = ({actions, layer, questionDot, layerMarkers, layerPoints, rmMarker, images}) => {
  const src = "data/images/catscan/" + images[layer];
  const dot = questionDot;
  return <div>
    <svg id="brainImage" xmlns="http://www.w3.org/2000/svg" style={styleSVG} viewBox="0 0 500 500" >
    <image x="0" y="0" width="100%" height="100%" xlinkHref={src} id="#brainImage" onClick={(e)=>actions.putMarker(e,false)}/>
          {layerPoints.map((contiguousPoints, i) =>
            <polygon style={styleSVG} key={i} onClick={(e) =>{console.log('hit');actions.putMarker(e,true)}}
            points={contiguousPoints.map((eachP, i) => i % 2 === 0 ? eachP - 5 : eachP) } />)}

      {dot && _.includes(dot.layers, layer) ? <QuestionDot color="green" position={dot.location} /> : ''}

      {layerMarkers.map((marker, i) =>
        <Marker color={"#93268f"} position={marker.position} key={i} onClick={() => rmMarker(i)} />)}
    </svg>
  </div>;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Region);
