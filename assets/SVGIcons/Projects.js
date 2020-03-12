import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

function SvgProjects(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 26 26" {...props}>
      <Defs>
        <ClipPath id="projects_svg__a">
          <Path
            data-name="Combined Shape"
            d="M11.513 23.885L.6 18.431a1.091 1.091 0 01.976-1.952L12 21.689l10.422-5.211a1.091 1.091 0 01.975 1.952l-10.909 5.455a1.086 1.086 0 01-.975 0zm0-5.454L.6 12.976a1.091 1.091 0 01.976-1.952L12 16.235l10.422-5.211a1.091 1.091 0 01.975 1.952l-10.909 5.455a1.092 1.092 0 01-.975 0zm0-5.455L.6 7.521a1.091 1.091 0 010-1.951L11.513.115a1.092 1.092 0 01.975 0L23.4 5.57a1.091 1.091 0 010 1.951l-10.912 5.455a1.092 1.092 0 01-.975 0zm-7.982-6.43L12 10.78l8.47-4.235L12 2.31z"
            fill="#34304c"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 109">
        <Path
          data-name="Combined Shape"
          d="M12.513 24.885L1.6 19.431a1.091 1.091 0 01.976-1.952L13 22.689l10.422-5.211a1.091 1.091 0 01.975 1.952l-10.909 5.455a1.086 1.086 0 01-.975 0zm0-5.454L1.6 13.976a1.091 1.091 0 01.976-1.952L13 17.235l10.422-5.211a1.091 1.091 0 01.975 1.952l-10.909 5.455a1.092 1.092 0 01-.975 0zm0-5.455L1.6 8.521a1.091 1.091 0 010-1.951l10.913-5.455a1.092 1.092 0 01.975 0L24.4 6.57a1.091 1.091 0 010 1.951l-10.912 5.455a1.092 1.092 0 01-.975 0zm-7.982-6.43L13 11.78l8.47-4.235L13 3.31z"
          fill="#34304c"
        />
        <G
          data-name="Mask Group 109"
          clipPath="url(#projects_svg__a)"
          transform="translate(1 1)"
        >
          <Path
            fill="#34304c"
            d="M-1.091-1.091h26.182v26.182H-1.091z"
            data-name="COLOR/ black"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgProjects;
