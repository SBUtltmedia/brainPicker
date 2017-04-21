const WIDTH = 30;
const HEIGHT = 55;
const OFFSET_X = 0 - WIDTH / 2;
const OFFSET_Y = 0 - HEIGHT / 4;  // inside the head of the pin

export default ({color, position, onClick}) => {
  const pathStyle = {
    fill: color,
    opacity: 0.9
  };

  const x = position[0] + OFFSET_X;
  const y = position[1] + OFFSET_Y;

  return(
  	<path style={pathStyle}
          onClick={onClick}
          transform={`translate(${x},${y})`}
    d="M25.74,12.87A12.87,12.87,0,1,0,9.32,25.23V40.73C9.32,42.75,11,50,13,50s3.66-7.25,3.66-9.27V25.17A12.87,12.87,0,0,0,25.74,12.87Z"/>
  );
};
