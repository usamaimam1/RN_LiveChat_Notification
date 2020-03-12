import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgUserAdded(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 25 25" {...props}>
      <Defs>
        <ClipPath id="user-added_svg__a">
          <Path
            data-name="Combined Shape"
            d="M9.375 11.875v-1.25A1.877 1.877 0 007.5 8.75H3.125a1.877 1.877 0 00-1.875 1.875v1.25a.625.625 0 01-1.25 0v-1.25A3.129 3.129 0 013.125 7.5H7.5a3.129 3.129 0 013.125 3.125v1.25a.625.625 0 01-1.25 0zm2.058-4.558l-1.25-1.25a.625.625 0 01.884-.884l.808.808 2.058-2.058a.625.625 0 11.884.884l-2.5 2.5a.625.625 0 01-.884 0zM2.188 3.125A3.125 3.125 0 115.312 6.25a3.128 3.128 0 01-3.124-3.125zm1.25 0A1.875 1.875 0 105.312 1.25a1.877 1.877 0 00-1.875 1.875z"
            fill="#fff"
          />
        </ClipPath>
      </Defs>
      <Path
        d="M12.5 0A12.5 12.5 0 110 12.5 12.5 12.5 0 0112.5 0z"
        fill="#4cb906"
      />
      <G data-name="Group 225">
        <Path
          data-name="Combined Shape"
          d="M15.375 17.875v-1.25A1.877 1.877 0 0013.5 14.75H9.125a1.877 1.877 0 00-1.875 1.875v1.25a.625.625 0 01-1.25 0v-1.25A3.129 3.129 0 019.125 13.5H13.5a3.129 3.129 0 013.125 3.125v1.25a.625.625 0 01-1.25 0zm2.058-4.558l-1.25-1.25a.625.625 0 01.884-.884l.808.808 2.058-2.058a.625.625 0 11.884.884l-2.5 2.5a.625.625 0 01-.884 0zM8.188 9.125a3.125 3.125 0 113.124 3.125 3.128 3.128 0 01-3.124-3.125zm1.25 0a1.875 1.875 0 101.874-1.875 1.877 1.877 0 00-1.875 1.875z"
          fill="#fff"
        />
        <G
          data-name="Mask Group 225"
          clipPath="url(#user-added_svg__a)"
          transform="translate(6 6)"
        >
          <Path fill="#fff" d="M0-1.25h15v15H0z" data-name="COLOR/ black" />
        </G>
      </G>
    </Svg>
  );
}

export default SvgUserAdded;
