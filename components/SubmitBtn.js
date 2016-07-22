import {Colors, Button,Column} from 'react-foundation';

const submitBtnStyle = {
  
};

export default ({questionNumber, onClick}) => (
  <Column small={2} large={4}>
  <Button color={Colors.SUCCESS} style={submitBtnStyle} onClick={onClick}>Submit</Button>
  </Column>
);
