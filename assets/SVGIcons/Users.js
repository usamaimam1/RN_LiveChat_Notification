import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgUsers(props) {
  return (
    <Svg width={16} height={18.051} {...props}>
      <Defs>
        <ClipPath id="users_svg__a">
          <Path
            data-name="Combined Shape"
            d="M15.111 18.051a.9.9 0 01-.889-.9v-1.8a2.691 2.691 0 00-2.667-2.708h-7.11a2.691 2.691 0 00-2.667 2.708v1.8a.9.9 0 01-.888.9.9.9 0 01-.889-.9v-1.8a4.484 4.484 0 014.445-4.513h7.111A4.484 4.484 0 0116 15.344v1.8a.9.9 0 01-.889.907zM8 9.025a4.484 4.484 0 01-4.444-4.512 4.445 4.445 0 118.889 0A4.484 4.484 0 018 9.025zM8 1.8a2.708 2.708 0 102.667 2.708A2.691 2.691 0 008 1.8z"
            fill="#758692"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 75">
        <Path
          data-name="Combined Shape"
          d="M15.111 18.051a.9.9 0 01-.889-.9v-1.8a2.691 2.691 0 00-2.667-2.708h-7.11a2.691 2.691 0 00-2.667 2.708v1.8a.9.9 0 01-.888.9.9.9 0 01-.889-.9v-1.8a4.484 4.484 0 014.445-4.513h7.111A4.484 4.484 0 0116 15.344v1.8a.9.9 0 01-.889.907zM8 9.025a4.484 4.484 0 01-4.444-4.512 4.445 4.445 0 118.889 0A4.484 4.484 0 018 9.025zM8 1.8a2.708 2.708 0 102.667 2.708A2.691 2.691 0 008 1.8z"
          fill="#758692"
        />
        <G data-name="Group 75" clipPath="url(#users_svg__a)">
          <Path
            d="M0-1.805h21.333v21.661H0z"
            fill="#758692"
            data-name="\uD83C\uDFA8Color"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgUsers;
