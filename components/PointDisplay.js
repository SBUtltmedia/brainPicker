import { connect } from 'react-redux';
import {Colors, Button, Sizes} from 'react-foundation';
import {changeLayer} from '../actions/actions';

const mapStateToProps = (state, ownProps) => {
  return {
		markers: state.currentQuestion.markers,
    pointsPerLayer:state.currentQuestion.pointsPerLayer,
    layerNum:state.currentQuestion.layer

  };
}
const mapDispatchToProps = (dispatch, ownProps, state) => ({

  		changeLayer: () => {
        console.log(ownProps)
        dispatch(changeLayer(ownProps.layer+1))
      }

});


const PointDisplay = ({markers,pointsPerLayer,layer,layerNum,changeLayer,isCurrentLayer}) =>{
const buttonColor = Colors.ALERT;
const layerMarkers = markers[layer];
const PDBtnStyle = {
  margin: "0",
};

const bumpStyle = {
  "position": "relative",
  "left" : "10",
  "top"  : "10"
};

console.log(layerMarkers);
 return (
   <div>
{ Array(pointsPerLayer).fill(0).map((nothing, i) =>
  	<Button style={layer==layerNum-1 ? bumpStyle:PDBtnStyle } size={Sizes.TINY} color={(layerMarkers || []).length > i ? Colors.SUCCESS : Colors.ALERT} key={i}   buttonNumber={i}   onClick={changeLayer}></Button>)}
</div>)

}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PointDisplay);
