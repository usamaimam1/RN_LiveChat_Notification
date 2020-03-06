import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

function SvgAddProject(props) {
  return (
    <Svg width={48} height={48} {...props}>
      <Circle cx={24} cy={24} r={24} fill="#f48a20" />
      <Path
        d="M23.983 32a1.091 1.091 0 00.759-.314 1.073 1.073 0 00.314-.758v-5.865h5.871a1.091 1.091 0 00.759-.314 1.073 1.073 0 00.314-.758 1.057 1.057 0 00-1.064-1.063h-5.872v-5.865a1.064 1.064 0 00-2.129 0v5.865h-5.871a1.063 1.063 0 100 2.126h5.872v5.865A1.036 1.036 0 0023.983 32z"
        fill="#fff"
        stroke="#fff"
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

export default SvgAddProject;
