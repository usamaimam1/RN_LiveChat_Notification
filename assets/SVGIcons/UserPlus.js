import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgUserPlus(props) {
  return (
    <Svg width={24} height={20} {...props}>
      <Defs>
        <ClipPath id="user-plus_svg__a">
          <Path
            data-name="Combined Shape"
            d="M16 20a1 1 0 01-1-1v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2a1 1 0 01-2 0v-2a5.006 5.006 0 015-5h7a5.006 5.006 0 015 5v2a1 1 0 01-1 1zm4-7a1 1 0 01-1-1v-2h-2a1 1 0 110-2h2V6a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 01-1 1zM8.5 10a5 5 0 115-5 5.005 5.005 0 01-5 5zm0-8a3 3 0 103 3 3 3 0 00-3-3z"
            transform="translate(0 2)"
            fill="#34304c"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 96">
        <Path
          data-name="Combined Shape"
          d="M16 20a1 1 0 01-1-1v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2a1 1 0 01-2 0v-2a5.006 5.006 0 015-5h7a5.006 5.006 0 015 5v2a1 1 0 01-1 1zm4-7a1 1 0 01-1-1v-2h-2a1 1 0 110-2h2V6a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 01-1 1zM8.5 10a5 5 0 115-5 5.005 5.005 0 01-5 5zm0-8a3 3 0 103 3 3 3 0 00-3-3z"
          fill="#34304c"
        />
        <G
          data-name="Mask Group 96"
          clipPath="url(#user-plus_svg__a)"
          transform="translate(0 -2)"
        >
          <Path
            fill="#34304c"
            d="M0 0h24v24H0z"
            data-name="\uD83C\uDFA8Color"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgUserPlus;
