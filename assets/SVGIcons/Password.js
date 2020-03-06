import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgPassword(props) {
  return (
    <Svg width={16} height={17.6} {...props}>
      <Defs>
        <ClipPath id="password_svg__a">
          <Path
            data-name="Combined Shape"
            d="M2.4 17.6A2.4 2.4 0 010 15.2V9.6a2.4 2.4 0 012.4-2.4h.8V4.8a4.8 4.8 0 019.6 0v2.4h.8A2.4 2.4 0 0116 9.6v5.6a2.4 2.4 0 01-2.4 2.4zm-.8-8v5.6a.8.8 0 00.8.8h11.2a.8.8 0 00.8-.8V9.6a.8.8 0 00-.8-.8H2.4a.8.8 0 00-.8.8zm9.6-2.4V4.8a3.2 3.2 0 10-6.4 0v2.4z"
            fill="#758692"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 180">
        <Path
          data-name="Combined Shape"
          d="M2.4 17.6A2.4 2.4 0 010 15.2V9.6a2.4 2.4 0 012.4-2.4h.8V4.8a4.8 4.8 0 019.6 0v2.4h.8A2.4 2.4 0 0116 9.6v5.6a2.4 2.4 0 01-2.4 2.4zm-.8-8v5.6a.8.8 0 00.8.8h11.2a.8.8 0 00.8-.8V9.6a.8.8 0 00-.8-.8H2.4a.8.8 0 00-.8.8zm9.6-2.4V4.8a3.2 3.2 0 10-6.4 0v2.4z"
          fill="#758692"
        />
        <G data-name="Mask Group 180" clipPath="url(#password_svg__a)">
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

export default SvgPassword;
