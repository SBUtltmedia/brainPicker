import ReactDom  from 'react-dom';
import ButtonBank from '../components/ButtonBank';
import Question from '../components/Question';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions';
import Marker from '../components/Marker';
import Monitor from '../components/Monitor'
import Region from '../components/Region'
import LayerChanger from '../components/LayerChanger'

const regionStyle = {
  width: "95%",
  float: "left"
};
const changerStyle = {
  width: "5%",
  height: "100%",
  float: "right"
};

class App extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    this.actions = bindActionCreators(Actions, dispatch);
    this.actions.loadQuestions();
    this.actions.loadStructures();
    this.actions.showQuestion(0);
  }

  render() {
    const { questions, structures, currentQuestion } = this.props;
    return <div>
      <div>
        <ButtonBank actions={this.actions} buttons={questions} />
        <Question actions={this.actions} currentQuestion={currentQuestion} />
      </div>
      <div>
        <Monitor actions={this.actions} currentQuestion={currentQuestion} />
      </div>
      <div style={regionStyle}>
        <Region actions={this.actions} currentQuestion={currentQuestion} />
      </div>
      <div style={changerStyle}>
        <LayerChanger actions={this.actions} currentQuestion={currentQuestion} />
      </div>
    </div>;
  }
}

function mapStateToProps(state) {
  return {...state};
}

export default connect(mapStateToProps)(App);
