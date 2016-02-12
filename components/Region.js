import _ from 'lodash';

const style = {
   fill: 'blue',
   stroke: "green",
   fillOpacity: 0.5,
   strokeOpacity: 0.5,
   strokeWidth: "10px"
 };

export default ({actions, currentQuestion}) => (
  <svg style={style} width={500} height={500}>
    <polygon onclick="console.log('hit')"
    points={_.values(currentQuestion.points)[0]}/>
  </svg>
);
