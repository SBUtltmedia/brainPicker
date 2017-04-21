import { connect } from 'react-redux';
import Marker from '../components/Marker';
import QuestionDot from '../components/QuestionDot';
import {removeMarker, putMarker} from '../actions/actions';
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
   const question = state.questions[ownProps.questionNumber]
   const points = question ? _.values(state.structures)[ownProps.questionNumber] : []
   const questionDot = question ? question.questionDot : undefined
   return {
     imgSrc: "data/images/catscan/" + state.images[state.layer],
     layer: state.layer,
     layerPoints: question ? points[(state.layer + 1).toString()] : [],
     layerMarkers: state.markers[state.layer - 1] || [],
     dot: questionDot && _.includes(dot.layers, layer) ? questionDot : undefined
   };
}

const Region = ({imgSrc, layer, dot, layerMarkers, layerPoints, removeMarker, putMarker}) => {
  return (
    <div>
      <svg id="brainImage"
           xmlns="http://www.w3.org/2000/svg"
           style={styleSVG}
           viewBox="0 0 500 500"
      >
        <image x="0"
               y="0"
               width="100%"
               height="100%"
               xlinkHref={imgSrc}
               id="#brainImage"
               onClick={() => putMarker(false)}
         />
            {layerPoints.map((contiguousPoints, i) =>
              <polygon style={styleSVG}
                       key={i}
                       onClick={() => putMarker(true)}
                       points={contiguousPoints.map((eachP, i) => i % 2 === 0 ? eachP - 5 : eachP)}
              />
            )}
        {dot && <QuestionDot color="green" position={dot.location} />}
        {layerMarkers.map((marker, i) =>
          <Marker color={"#93268f"}
                  position={marker.position}
                  key={i}
                  onClick={() => removeMarker(i)}
          />
        )}
      </svg>
    </div>
  )
}

export default connect(
  mapStateToProps,
  {removeMarker, putMarker}
)(Region);
