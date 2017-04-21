export default ({color, position}) => {
  const pathStyle = {
    fill:color,
    opacity:0.9
  };

  return(
  	 <circle cx={position[0]} cy={position[1]} r="10" fill={color} />
  );
};
