import React from 'react';
import BrainRegion from './Region.jsx';


class Main extends React.Component {
  render() {
    return <BrainRegion name="Phred"/>
  }
}


React.render(<Main />, document.getElementById('root'));
