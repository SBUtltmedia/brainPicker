import QuestionButton from './QuestionButton';
import SubmitBtn from '../components/SubmitBtn'
import {Colors, Button,Link} from 'react-foundation';
export default ({actions, questions}) => {

	return <div>
		{ questions.map((question, i) =>
			<QuestionButton key={i} questionNumber={i} clickFunc={() => actions.showQuestion(question)} />) }
			<SubmitBtn onClick={actions.submitAnswers} />
			<div className="button-basics-example">
			  <Link>Learn More</Link>
			  <Link>View All Features</Link>
			  <Button color={Colors.SUCCESS}>Save</Button>
			  <Button color={Colors.ALERT}>Delete</Button>
			</div>

	</div>
};
