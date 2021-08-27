import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgMark(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 23 23" {...props}>
      <Path
        d="M11.5 23A11.5 11.5 0 013.368 3.368a11.5 11.5 0 1116.264 16.264A11.424 11.424 0 0111.5 23zm-4-11.5a1 1 0 00-.707 1.707l3 3a1 1 0 001.555-.177l5-8a1.002 1.002 0 10-1.7-1.06l-4.341 6.94-2.1-2.117A.994.994 0 007.5 11.5z"
        fill="#4cb906"
      />
    </Svg>
  );
}

export default SvgMark;
