import * as React from "react";
import Svg, { Defs, ClipPath, Path, G, Circle } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgUpload(props) {
  return (
    <Svg width={111} height={111} {...props}>
      <Defs>
        <ClipPath id="upload_svg__b">
          <Path
            data-name="Combined Shape"
            d="M43.749 41.666h-37.5A6.256 6.256 0 010 35.416V12.5a6.257 6.257 0 016.249-6.251h7.219L17.015.928A2.087 2.087 0 0118.75 0h12.5a2.08 2.08 0 011.732.928l3.549 5.321h7.217A6.258 6.258 0 0150 12.5v22.916a6.257 6.257 0 01-6.251 6.25zm-37.5-31.249A2.085 2.085 0 004.166 12.5v22.916A2.085 2.085 0 006.249 37.5h37.5a2.085 2.085 0 002.083-2.083V12.5a2.085 2.085 0 00-2.083-2.083h-8.333a2.082 2.082 0 01-1.734-.928l-3.547-5.323h-10.27l-3.549 5.323a2.08 2.08 0 01-1.732.928zM25 33.333a10.416 10.416 0 1110.416-10.417A10.428 10.428 0 0125 33.333zm0-16.667a6.25 6.25 0 106.251 6.249A6.256 6.256 0 0025 16.667z"
            fill="#8e8e8e"
          />
        </ClipPath>
      </Defs>
      <G data-name="upload">
        <Circle
          data-name="Mask"
          cx={55}
          cy={55}
          r={55}
          transform="translate(.5 .5)"
          fill="#fbfcfe"
          stroke="#e5eaed"
          opacity={0.35}
        />
        <G data-name="Group 192">
          <Path
            data-name="Combined Shape"
            d="M74.249 76.166h-37.5a6.256 6.256 0 01-6.249-6.25V47a6.257 6.257 0 016.249-6.251h7.219l3.547-5.321a2.087 2.087 0 011.735-.928h12.5a2.08 2.08 0 011.732.928l3.549 5.321h7.217A6.258 6.258 0 0180.5 47v22.916a6.257 6.257 0 01-6.251 6.25zm-37.5-31.249A2.085 2.085 0 0034.666 47v22.916A2.085 2.085 0 0036.749 72h37.5a2.085 2.085 0 002.083-2.083V47a2.085 2.085 0 00-2.083-2.083h-8.333a2.082 2.082 0 01-1.734-.928l-3.547-5.323h-10.27l-3.549 5.323a2.08 2.08 0 01-1.732.928zM55.5 67.833a10.416 10.416 0 1110.416-10.417A10.428 10.428 0 0155.5 67.833zm0-16.667a6.25 6.25 0 106.251 6.249 6.256 6.256 0 00-6.251-6.248z"
            fill="#8e8e8e"
          />
          <G
            data-name="Mask Group 192"
            clipPath="url(#upload_svg__b)"
            transform="translate(30.5 34.5)"
          >
            <Path
              fill="#8e8e8e"
              d="M0-4.167h49.999v49.999H0z"
              data-name="COLOR/ black"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgUpload;
