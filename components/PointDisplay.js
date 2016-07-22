import { connect } from 'react-redux';
import {Colors, Button} from 'react-foundation';
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


const PointDisplay = ({markers,pointsPerLayer,layer,layerNum,changeLayer}) =>{
const buttonColor = Colors.ALERT;
const layerMarkers = markers[layer];
console.log(layerMarkers);
 return (
   <div>
{ Array(pointsPerLayer).fill(0).map((nothing, i) =>	<Button color={(layerMarkers || []).length > i ? Colors.SUCCESS : Colors.ALERT} key={i}  buttonNumber={i}   onClick={changeLayer}></Button>)}
</div>)

}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PointDisplay);
