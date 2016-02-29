import Catscan from '../components/Catscan';

const style = {
   fill: 'blue',
   stroke: "green",
   fillOpacity: 0.5,
   strokeOpacity: 0.5,
   strokeWidth: "10px",
  margin : 0 ,
  padding: 0,
   width:500,
   height : 500,
   position : 'absolute',
   left : 0,
   top : 0,
 };

 const styleCatscat = {
   margin : 0 ,
   padding: 0,
   position : 'absolute',
   left: 0,
   width:'inherit',
   height : 'inherit',
   top : 0

 };

export default ({actions, currentQuestion}) => {
if(currentQuestion.points[currentQuestion.layer]){

return(
  <div style={style}>

  <Catscan currentQuestion={currentQuestion}  style={styleCatscat}/>
  <svg style={style} >


  {currentQuestion.points[currentQuestion.layer].map((contiguousPoints,i) =>
    <polygon key={i} onClick={() => console.log('hit')}
    points={contiguousPoints}/>)}

  </svg>

</div>
)
}
else {
  return(
    <svg style={style} width={500} height={500}>

    </svg>
  )


}

}
;
