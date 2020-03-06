import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgBack(props) {
  return (
    <Svg width={18} height={14} {...props}>
      <Defs>
        <ClipPath id="back_svg__a">
          <Path
            data-name="Combined Shape"
            d="M6.293 13.707l-6-6-.036-.037-.015-.018-.007-.008-.009-.01-.009-.012-.005-.007L.2 7.6l-.014-.019-.014-.021-.014-.02-.012-.02-.012-.02v-.005L.122 7.48v-.008l-.01-.012-.006-.011V7.44l-.012-.016L.083 7.4a1 1 0 010-.8l.008-.017v-.009L.1 6.562l.007-.014v-.006a1 1 0 01.182-.25l6-6a1 1 0 011.418 1.415L3.414 6H17a1 1 0 010 2H3.414l4.293 4.293a1 1 0 11-1.414 1.414z"
            transform="translate(3 5)"
            fill="#34304c"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 158">
        <Path
          data-name="Combined Shape"
          d="M6.293 13.707l-6-6-.036-.037-.015-.018-.007-.008-.009-.01-.009-.012-.005-.007L.2 7.6l-.014-.019-.014-.021-.014-.02-.012-.02-.012-.02v-.005L.122 7.48v-.008l-.01-.012-.006-.011V7.44l-.012-.016L.083 7.4a1 1 0 010-.8l.008-.017v-.009L.1 6.562l.007-.014v-.006a1 1 0 01.182-.25l6-6a1.002 1.002 0 011.418 1.415L3.414 6H17a1 1 0 010 2H3.414l4.293 4.293a1 1 0 11-1.414 1.414z"
          fill="#34304c"
        />
        <G
          data-name="Mask Group 158"
          clipPath="url(#back_svg__a)"
          transform="translate(-3 -5)"
        >
          <Path fill="#34304c" d="M0 0h24v24H0z" data-name="COLOR/ black" />
        </G>
      </G>
    </Svg>
  );
}

export default SvgBack;
