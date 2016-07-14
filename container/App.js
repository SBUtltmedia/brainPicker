import ReactDom  from 'react-dom';
import ButtonBank from '../components/ButtonBank';
import Question from '../components/Question';
import Status from '../components/Status';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions';
import Marker from '../components/Marker';
import Monitor from '../components/Monitor';
import Region from '../components/Region';
import LayerChanger from '../components/LayerChanger';
import {Grid,Column,Row} from 'react-foundation';
import SubmitBtn from '../components/SubmitBtn';
//import MultistepSlider from 'react-multistep';

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

          <Row className="display">
          <Column large={6} columns>
          <Monitor actions={this.actions} currentQuestion={currentQuestion} images={images} />
          </Column>
          <Column large={1} columns>
          <LayerChanger style={changerStyle} layer={currentQuestion.layer} actions={this.actions} value={this.actions.findQuestionDot.bind()} max={images.length} currentQuestion={currentQuestion} />
          </Column>
          <Column large={5} columns>
          <Row className="display">
          <Question actions={this.actions} currentQuestion={currentQuestion} />
          <Status actions={this.actions} currentQuestion={currentQuestion} />
          <Row className="display">
          <Column large={4}  offsetOnLarge={6}>
            <SubmitBtn onClick={this.actions.submitAnswers} />
          </Column>
          </Row>
          </Row>
          <Row className="display">
          <ButtonBank actions={this.actions} questions={questions}/>
          </Row>
          </Column>
          </Row>








    </div>;
  }
}

function mapStateToProps(state) {
  return {...state};
}

export default connect(mapStateToProps)(App);
