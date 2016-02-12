import ReactDom  from 'react-dom';
//import BrainRegion from '../components/Region';
import RegionBtn from '../components/ButtonBank';
var structure = require ('json!../data/structure.json');
var question = require ('json!../data/question.json');
var points= structure["area medial and caudal to the green point"]["1"][0];
console.log(points);

class App extends React.Component {
  render() {
    return ( <RegionBtn buttons={question} /> );
  }
}

export default App;
