const style = {
   fill: 'blue',
   stroke: "green",
   fillOpacity: 0.5,
   strokeOpacity: 0.5,
   strokeWidth: "10px"
 };

export default ({actions, currentQuestion}) => {
if(currentQuestion.points[currentQuestion.layer]){
return(
  <svg style={style} width={500} height={500}>
  {currentQuestion.points[currentQuestion.layer].map((contiguousPoints,i) =>
    <polygon onClick={() => console.log('hit')}
    points={contiguousPoints}/>)}
  </svg>
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
