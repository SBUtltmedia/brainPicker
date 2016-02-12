import ReactDom  from 'react-dom';
//import BrainRegion from '../components/Region';
import ButtonBank from '../components/ButtonBank';
import Question from '../components/Question';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions';

class App extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    this.actions = bindActionCreators(Actions, dispatch);
    this.actions.loadQuestions();
    this.actions.loadStructures();
    this.actions.showQuestion("area medial and caudal to the green point");
  }

  render() {
    const { questions, structures, currentQuestion } = this.props;
    return <div>
      <ButtonBank actions={this.actions} buttons={questions} />
      <Question actions={this.actions} currentQuestion={currentQuestion} />
    </div>;
  }
}

function mapStateToProps(state) {
  return {...state};
}

export default connect(mapStateToProps)(App);
