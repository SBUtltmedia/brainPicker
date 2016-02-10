import React from 'react';
var fileContent = require("raw!./polygon.svg");

console.log(fileContent);
function createMarkup() { return {__html: fileContent}; };
export default class BrainRegion {
  render() {
let style =
{
   fill: 'orange',
   stroke: "green",
   fillOpacity:0,
   strokeWidth: "10px"
 };

    return  <div className="poly" dangerouslySetInnerHTML={createMarkup()}></div>

  }
}
