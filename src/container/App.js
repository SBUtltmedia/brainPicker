import ReactDom  from 'react-dom';
import ButtonBank from '../components/ButtonBank';
import Question from '../components/Question';
import Status from '../components/Status';
import { connect } from 'react-redux';
import {submitAnswers} from '../actions/actions';
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

const App = ({layer, numImages, submitAnswers}) => (
  <div>
    <Row className="display">
      <Column large={8} columns><h1>BrainPicker</h1></Column>
      <Column large={4} columns><h3>Stonybrook University</h3></Column>
    </Row>
    <Row className="display">
      <Column large={6} small={12} medium={5} columns>
        <Monitor />
      </Column>
      <Column large={2} columns>
        <LayerChanger style={changerStyle} layer={layer} max={numImages} />
      </Column>
      <Column large={4} columns>
        <Row className="display">
          <Question />
          <Status />
          <Row className="display">
            <Column large={4} offsetOnLarge={6}>
              <SubmitBtn onClick={submitAnswers} />
            </Column>
          </Row>
        </Row>
        <Row className="display">
          <ButtonBank />
        </Row>
      </Column>
    </Row>
  </div>
)

const mapStateToProps = (state) => ({
  layer: state.layer,
  numImages: state.images.length
})

export default connect(
  mapStateToProps,
  {submitAnswers}
)(App);
