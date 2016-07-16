import { connect } from 'react-redux';
import {Colors, Button} from 'react-foundation';

const mapStateToProps = (state, ownProps) => {
  return {
		markers: state.currentQuestion.markers,
    pointsPerLayer:state.currentQuestion.pointsPerLayer
  };
}
const mapDispatchToProps = (dispatch, ownProps, state) => ({
	showQuestion: () => dispatch(showQuestion(ownProps.question))
});


const PointDisplay = ({markers,pointsPerLayer}) =>{
const buttonColor = Colors.ALERT;
console.log(pointsPerLayer)
 return (
   <div>
{ Array(pointsPerLayer).fill(0).map((nothing, i) =>	<Button color={buttonColor} buttonNumber={i} >{i}</Button>)}
</div>)

}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PointDisplay);
