import * as React from "react";
import Svg, { Defs, ClipPath, Path, G, Circle } from "react-native-svg";

function SvgIssue(props) {
  return (
    <Svg width={26} height={26} {...props}>
      <Defs>
        <ClipPath id="issue_svg__a">
          <Path
            data-name="Combined Shape"
            d="M1.614 11.072a1.637 1.637 0 01-1.4-.834 1.681 1.681 0 01.008-1.652L4.835.8a1.625 1.625 0 012.8 0l4.618 7.8a1.675 1.675 0 010 1.645 1.642 1.642 0 01-1.408.834zm4.155-9.706L1.16 9.145a.556.556 0 000 .548.539.539 0 00.461.278h9.221a.551.551 0 00.47-.818L6.7 1.367a.548.548 0 00-.466-.267.54.54 0 00-.465.266zm.08 6.791a.555.555 0 010-.779.541.541 0 01.771 0 .555.555 0 010 .779.541.541 0 01-.771 0zm-.16-2.042v-2.2a.545.545 0 111.089 0v2.2a.545.545 0 11-1.089 0z"
            fill="#fff"
          />
        </ClipPath>
      </Defs>
      <G>
        <Circle cx={13} cy={13} r={13} fill="#f48a20" />
        <G data-name="Group 116">
          <Path
            data-name="Combined Shape"
            d="M8.614 18.072a1.637 1.637 0 01-1.4-.834 1.681 1.681 0 01.008-1.652L11.835 7.8a1.625 1.625 0 012.8 0l4.618 7.8a1.675 1.675 0 010 1.645 1.642 1.642 0 01-1.408.834zm4.155-9.706L8.16 16.145a.556.556 0 000 .548.539.539 0 00.461.278h9.221a.551.551 0 00.47-.818L13.7 8.367a.548.548 0 00-.466-.267.54.54 0 00-.465.266zm.08 6.791a.555.555 0 010-.779.541.541 0 01.771 0 .555.555 0 010 .779.541.541 0 01-.771 0zm-.16-2.042v-2.2a.545.545 0 111.089 0v2.2a.545.545 0 11-1.089 0z"
            fill="#fff"
          />
          <G
            data-name="Mask Group 116"
            transform="translate(7 7)"
            clipPath="url(#issue_svg__a)"
          >
            <Path
              fill="#fff"
              d="M-.546-1.102h13.073v13.219H-.546z"
              data-name="COLOR/ black"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgIssue;
