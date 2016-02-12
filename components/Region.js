 export default class BrainRegion {

  render() {
  console.log(this.props.points);
let style =
{
   fill: 'orange',
   stroke: "green",
   fillOpacity:0,
   strokeWidth: "10px"
 };

    return (
    <svg width={500} height={500}>
    <polygon onclick="console.log('hit')" points={this.props.points}/>

  </svg>

  )
  }
}
