import React from 'react';
import BrainRegion from './region.jsx';


class Main extends React.Component {
  render() {
    return <BrainRegion name="Phred"/>
  }
}


React.render(<Main />, document.getElementById('root'));
