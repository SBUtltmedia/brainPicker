
export default ({color,position}) => {
var pathStyle={
  fill:color,
  opacity:0.9
}

console.log("position", position);

return(
	<path style={pathStyle} transform={"translate(" + position[0] + "," + position[1] + ")"}
  d="M25.74,12.87A12.87,12.87,0,1,0,9.32,25.23V40.73C9.32,42.75,11,50,13,50s3.66-7.25,3.66-9.27V25.17A12.87,12.87,0,0,0,25.74,12.87Z"/>
)};
