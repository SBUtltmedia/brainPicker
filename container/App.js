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
    const { dispatch, questions, structures, images } = this.props;
    this.actions = bindActionCreators(Actions, dispatch);
    //this.actions.showQuestion(questions[0], structures);
  }

  render() {
    const { questions, structures, currentQuestion, images } = this.props;
    return <div>
      <div>
        <ButtonBank actions={this.actions} questions={questions} structures={structures} />
        <Question actions={this.actions} currentQuestion={currentQuestion} />
      </div>
      <div>
        <Monitor actions={this.actions} currentQuestion={currentQuestion} value={this.actions.findQuestionDot()} images={images} />
      </div>
    </div>;
  }
}

function mapStateToProps(state) {
  return {...state};
}

export default connect(mapStateToProps)(App);
