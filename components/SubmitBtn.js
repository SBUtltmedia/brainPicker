import {Colors, Button} from 'react-foundation';

const submitBtnStyle = {
  float: "right",
  marginRight:"5%"
};

export default ({questionNumber, onClick}) => (
	<Button color={Colors.SUCCESS} style={submitBtnStyle} onClick={onClick}>Submit</Button>
);
