import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgTeam(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 20" {...props}>
      <Defs>
        <ClipPath id="team_svg__a">
          <Path
            data-name="Combined Shape"
            d="M23 20a1 1 0 01-1-1v-2a3 3 0 00-2.25-2.9 1 1 0 11.5-1.937A5 5 0 0124 17v2a1 1 0 01-1 1zm-6 0a1 1 0 01-1-1v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2a1 1 0 01-2 0v-2a5.006 5.006 0 015-5h8a5.006 5.006 0 015 5v2a1 1 0 01-1 1zM9 10a5 5 0 115-5 5.006 5.006 0 01-5 5zm0-8a3 3 0 103 3 3 3 0 00-3-3zm7 7.88a1 1 0 01-.248-1.969 3 3 0 000-5.812 1 1 0 11.5-1.938 5 5 0 010 9.688.985.985 0 01-.252.031z"
            transform="translate(0 2)"
            fill="#34304c"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 75">
        <Path
          data-name="Combined Shape"
          d="M23 20a1 1 0 01-1-1v-2a3 3 0 00-2.25-2.9 1 1 0 11.5-1.937A5 5 0 0124 17v2a1 1 0 01-1 1zm-6 0a1 1 0 01-1-1v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2a1 1 0 01-2 0v-2a5.006 5.006 0 015-5h8a5.006 5.006 0 015 5v2a1 1 0 01-1 1zM9 10a5 5 0 115-5 5.006 5.006 0 01-5 5zm0-8a3 3 0 103 3 3 3 0 00-3-3zm7 7.88a1 1 0 01-.248-1.969 3 3 0 000-5.812 1 1 0 11.5-1.938 5 5 0 010 9.688.985.985 0 01-.252.031z"
          fill="#34304c"
        />
        <G
          data-name="Mask Group 75"
          clipPath="url(#team_svg__a)"
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

export default SvgTeam;
