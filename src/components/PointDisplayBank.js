
import { connect } from 'react-redux';
import {Colors, Button} from 'react-foundation';
import {changeLayer} from '../actions/actions';
import PointDisplay from './PointDisplay';
const mapStateToProps = (state, ownProps) => {
  return {
		markers: state.markers,
    pointsPerLayer:state.pointsPerLayer,
  };
}
const mapDispatchToProps = (dispatch, ownProps, state) => ({

});



export default ({max,currentLayer}) => {
console.log(max)

	return <div>


	{ Array(max).fill(0).map((nothing, i) =>	<PointDisplay   key={i} layer={max - 1 - i}/>)}
	</div>



};
