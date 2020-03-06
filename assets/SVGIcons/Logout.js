import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgLogout(props) {
  return (
    <Svg width={16} height={17.603} {...props}>
      <Defs>
        <ClipPath id="logout_svg__a">
          <Path
            data-name="Combined Shape"
            d="M2.344 15.26a8 8 0 010-11.314.8.8 0 011.13 1.132 6.4 6.4 0 109.053 0 .8.8 0 111.131-1.131A8 8 0 012.344 15.26zM7.2 8.8v-8a.8.8 0 011.6 0v8a.8.8 0 01-1.6 0z"
            fill="#758692"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 50">
        <Path
          data-name="Combined Shape"
          d="M2.344 15.26a8 8 0 010-11.314.8.8 0 011.13 1.132 6.4 6.4 0 109.053 0 .8.8 0 111.131-1.131A8 8 0 012.344 15.26zM7.2 8.8v-8a.8.8 0 011.6 0v8a.8.8 0 01-1.6 0z"
          fill="#758692"
        />
        <G data-name="Mask Group 50" clipPath="url(#logout_svg__a)">
          <Path
            fill="#758692"
            d="M-1.6-.8h19.2v19.2H-1.6z"
            data-name="COLOR/ black"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgLogout;
