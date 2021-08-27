import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgUsersActive(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 19.5 22" {...props}>
      <Defs>
        <ClipPath id="users-active_svg__a">
          <Path
            data-name="Combined Shape"
            d="M18.417 22a1.093 1.093 0 01-1.084-1.1v-2.2a3.279 3.279 0 00-3.25-3.3H5.417a3.28 3.28 0 00-3.251 3.3v2.2A1.093 1.093 0 011.084 22 1.093 1.093 0 010 20.9v-2.2a5.465 5.465 0 015.417-5.5h8.666a5.465 5.465 0 015.417 5.5v2.2a1.093 1.093 0 01-1.083 1.1zM9.75 11a5.465 5.465 0 01-5.416-5.5 5.417 5.417 0 1110.833 0A5.465 5.465 0 019.75 11zm0-8.8A3.3 3.3 0 1013 5.5a3.279 3.279 0 00-3.25-3.3z"
            fill="#34304c"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 75">
        <Path
          data-name="Combined Shape"
          d="M18.417 22a1.093 1.093 0 01-1.084-1.1v-2.2a3.279 3.279 0 00-3.25-3.3H5.417a3.28 3.28 0 00-3.251 3.3v2.2A1.093 1.093 0 011.084 22 1.093 1.093 0 010 20.9v-2.2a5.465 5.465 0 015.417-5.5h8.666a5.465 5.465 0 015.417 5.5v2.2a1.093 1.093 0 01-1.083 1.1zM9.75 11a5.465 5.465 0 01-5.416-5.5 5.417 5.417 0 1110.833 0A5.465 5.465 0 019.75 11zm0-8.8A3.3 3.3 0 1013 5.5a3.279 3.279 0 00-3.25-3.3z"
          fill="#34304c"
        />
        <G data-name="Group 75" clipPath="url(#users-active_svg__a)">
          <Path
            d="M0-2.2h26v26.4H0z"
            fill="#34304c"
            data-name="\uD83C\uDFA8Color"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgUsersActive;