import React from 'react';
import BrainRegion from './Region.jsx';
var structure = require ('json!./structure.json');

//console.log(structure);

class Main extends React.Component {
  render() {
    return <BrainRegion name="Phred"/>
  }
}


React.render(<Main />, document.getElementById('root'));
