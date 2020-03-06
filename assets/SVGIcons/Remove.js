import * as React from "react";
import Svg, { Defs, ClipPath, Path, G, Circle } from "react-native-svg";

function SvgRemove(props) {
  return (
    <Svg width={25} height={25} {...props}>
      <Defs>
        <ClipPath id="remove_svg__a">
          <Path
            data-name="Combined Shape"
            d="M2.75 13a1.715 1.715 0 01-1.65-1.773V3.546H.55A.572.572 0 010 2.955a.572.572 0 01.55-.591h2.2v-.591A1.714 1.714 0 014.4 0h2.2a1.715 1.715 0 011.65 1.773v.591h2.2a.572.572 0 01.55.591.572.572 0 01-.55.591H9.9v7.681A1.714 1.714 0 018.25 13zm-.55-1.773a.572.572 0 00.55.591h5.5a.572.572 0 00.55-.591V3.546H2.2zm4.95-8.864v-.59a.572.572 0 00-.55-.591H4.4a.572.572 0 00-.55.591v.591zm-1.1 7.092V5.909a.551.551 0 111.1 0v3.546a.551.551 0 11-1.1 0zm-2.2 0V5.909a.551.551 0 111.1 0v3.546a.551.551 0 11-1.1 0z"
            fill="#fff"
          />
        </ClipPath>
      </Defs>
      <G>
        <Circle cx={12.5} cy={12.5} r={12.5} fill="#f48a20" />
        <G data-name="Group 105">
          <Path
            data-name="Combined Shape"
            d="M9.75 19a1.715 1.715 0 01-1.65-1.773V9.546h-.55A.572.572 0 017 8.955a.572.572 0 01.55-.591h2.2v-.591A1.714 1.714 0 0111.4 6h2.2a1.715 1.715 0 011.65 1.773v.591h2.2a.572.572 0 01.55.591.572.572 0 01-.55.591h-.55v7.681A1.714 1.714 0 0115.25 19zm-.55-1.773a.572.572 0 00.55.591h5.5a.572.572 0 00.55-.591V9.546H9.2zm4.95-8.864v-.59a.572.572 0 00-.55-.591h-2.2a.572.572 0 00-.55.591v.591zm-1.1 7.092v-3.546a.551.551 0 111.1 0v3.546a.551.551 0 11-1.1 0zm-2.2 0v-3.546a.551.551 0 111.1 0v3.546a.551.551 0 11-1.1 0z"
            fill="#fff"
          />
          <G
            data-name="Mask Group 105"
            clipPath="url(#remove_svg__a)"
            transform="translate(7 6)"
          >
            <Path
              fill="#fff"
              d="M-1.1-.591h13.2v14.182H-1.1z"
              data-name="\uD83C\uDFA8Color"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgRemove;
