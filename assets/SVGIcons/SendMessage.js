import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

function SvgSendMessage(props) {
  return (
    <Svg width={40} height={40} {...props}>
      <Rect
        data-name="Rectangle Copy"
        width={40}
        height={40}
        rx={20}
        fill="#f48a20"
      />
      <Path d="M11.914 28l6.97-8.346L11 12l20 6.822L11.914 28z" fill="#fff" />
    </Svg>
  );
}

export default SvgSendMessage;
