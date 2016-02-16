import _ from 'lodash';
export default ({actions, currentQuestion}) => (
	<div>
		{ _.keys(currentQuestion.points).map(layer =>
			<button key={layer} onClick={() => actions.changeLayer(layer)}>{layer}</button>) }
	</div>
);
