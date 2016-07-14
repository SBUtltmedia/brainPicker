import QuestionButton from './QuestionButton';
import {Column} from 'react-foundation';
export default ({actions, questions}) => {

	return <div>
		{ questions.map((question, i) =>
			<QuestionButton key={i} question={question} questionNumber={i} />) }



	</div>
};
