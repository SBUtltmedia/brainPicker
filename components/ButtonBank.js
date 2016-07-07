import VisibleQuestionButton from './VisibleQuestionButton';
import SubmitBtn from '../components/SubmitBtn';
import {Grid,Column,Row} from 'react-foundation';
export default ({actions, questions}) => {

	return <Column small={6} large={8}>
		{ questions.map((question, i) =>
			<VisibleQuestionButton key={i} question={question} questionNumber={i} />) }
			<SubmitBtn onClick={actions.submitAnswers} />


	</Column>
};
