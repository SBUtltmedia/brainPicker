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
   height : '100%',
 };

 // Enables xmlns tag in SVG
const DOMProperty = require('react/lib/ReactInjection').DOMProperty;
DOMProperty.injectDOMPropertyConfig({
  Properties: {
    xmlns: DOMProperty.MUST_USE_ATTRIBUTE
  },
  isCustomAttribute: (attributeName) => {
    return attributeName === 'xmlns';
  }
});

 const mapStateToProps = (state, ownProps) => {
   return {
     isCurrentQuestion: state.currentQuestion.questionNumber === ownProps.questionNumber
   };
 }
 const mapDispatchToProps = dispatch => ({
 	rmMarker: index => dispatch(removeMarker(index))
 });

const Region = ({actions, currentQuestion, rmMarker, images}) => {
  const src = "data/images/catscan/" + images[currentQuestion.layer];
// src = "data/images/catscan/001.png"
//  const src = "data/images/catscan/"+Array(3-i.toString().length).fill("0").join("")+i+".png";
  // .log("CURRENTQUESITON POINTS",JSON.stringify(currentQuestion));
  console.log
  const points = currentQuestion.points[(currentQuestion["layer"]+1).toString()] || [] ;
//  console.log(JSON.stringify(structures));
//  const points = currentQuestion.points[currentQuestion.layer] || [];
  const markers = currentQuestion.markers[currentQuestion.layer - 1] || [];
  const dot = currentQuestion.questionDot;
  return <div>
    <svg id="brainImage" xmlns="http://www.w3.org/2000/svg" style={styleSVG} viewBox="0 0 500 500" >
    <image x="0" y="0" width="100%" height="100%" xlinkHref={src} id="#brainImage" onClick={(e)=>actions.putMarker(e,false)}/>
          {points.map((contiguousPoints, i) =>
            <polygon style={styleSVG} key={i} onClick={(e) =>{console.log('hit');actions.putMarker(e,true)}}
            points={contiguousPoints.map((eachP, i) => i % 2 === 0 ? eachP - 5 : eachP) } />)}

      {dot && _.includes(dot.layers, currentQuestion.layer) ? <QuestionDot color="green" position={dot.location} /> : ''}

      {markers.map((marker, i) =>
        <Marker color={"#93268f"} position={marker.position} key={i} onClick={() => rmMarker(i)} />)}


    </svg>
  </div>;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Region);
