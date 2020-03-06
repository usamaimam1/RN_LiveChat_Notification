import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgMenu(props) {
  return (
    <Svg width={20} height={14} {...props}>
      <Defs>
        <ClipPath id="menu_svg__a">
          <Path
            data-name="Combined Shape"
            d="M1 14a1 1 0 010-2h18a1 1 0 010 2zm0-6a1 1 0 010-2h18a1 1 0 010 2zm0-6a1 1 0 010-2h18a1 1 0 010 2z"
            transform="translate(2 5)"
            fill="#34304c"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 182">
        <Path
          data-name="Combined Shape"
          d="M1 14a1 1 0 010-2h18a1 1 0 010 2zm0-6a1 1 0 010-2h18a1 1 0 010 2zm0-6a1 1 0 010-2h18a1 1 0 010 2z"
          fill="#34304c"
        />
        <G
          data-name="Mask Group 182"
          clipPath="url(#menu_svg__a)"
          transform="translate(-2 -5)"
        >
          <Path fill="#34304c" d="M0 0h24v24H0z" data-name="COLOR/ black" />
        </G>
      </G>
    </Svg>
  );
}

export default SvgMenu;
