

export default ({currentQuestion}) => {
  console.log(currentQuestion);
 var src="data/images/catscan/"+(currentQuestion.layer+1)+".png";

  return(
    <img src={src}/>


  )
};
