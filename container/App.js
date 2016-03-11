import ReactDom  from 'react-dom';
import ButtonBank from '../components/ButtonBank';
import Question from '../components/Question';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions';
import Marker from '../components/Marker';
import Monitor from '../components/Monitor'



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

    </div>;
  }
}

function mapStateToProps(state) {
  return {...state};
}

export default connect(mapStateToProps)(App);
