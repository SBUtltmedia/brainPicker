const submitBtnStyle = {
  float: "right",
  marginRight:"5%"
};

export default ({questionNumber, onClick}) => (
	<button style={submitBtnStyle} onClick={onClick}>Submit</button>
);
