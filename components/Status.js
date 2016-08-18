import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
		mark: state.markers || [],
		totalPoints: state.requestLayers * state.pointsPerLayer,
		layersLeft: state.requestLayers - state.markers.reduce((a, b) => b ? a + 1 : a, 0),
		layerMarkersLeft: state.markers[state.layer - 1] ? state.markers[state.layer - 1].length : 0
  };
}

const Status = ({mark, totalPoints, layersLeft, layerMarkersLeft}) => {
	var pointsPut = 0 ;
	if(mark.length > 0) {
		pointsPut = (mark.map((h)=>{var accum=0;if(h) accum+=h.length;return accum;})).reduce( (prev, curr) => prev + curr );
	}
	var currLayerText=`and there are ${layerMarkersLeft} marker(s) on this layer`;
	return <div>
		You have {totalPoints - pointsPut} point(s) left and {layersLeft} layers left, {currLayerText}
	</div>;
}

export default connect(
	mapStateToProps,
	{}
)(Status);
