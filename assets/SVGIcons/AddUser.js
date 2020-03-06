import * as React from "react";
import Svg, { Defs, ClipPath, Path, G, Circle } from "react-native-svg";

function SvgAddUser(props) {
  return (
    <Svg width={25} height={25} {...props}>
      <Defs>
        <ClipPath id="add-user_svg__a">
          <Path
            data-name="Combined Shape"
            d="M10 12.692a.631.631 0 01-.625-.635v-1.269A1.892 1.892 0 007.5 8.885H3.125a1.892 1.892 0 00-1.875 1.9v1.269a.631.631 0 01-.625.635.631.631 0 01-.625-.631v-1.27a3.153 3.153 0 013.125-3.173H7.5a3.153 3.153 0 013.125 3.173v1.269a.631.631 0 01-.625.635zm2.5-4.442a.631.631 0 01-.625-.635V6.346h-1.25a.635.635 0 010-1.269h1.25V3.808a.625.625 0 111.25 0v1.269h1.25a.635.635 0 010 1.269h-1.25v1.269a.631.631 0 01-.625.635zm-7.188-1.9a3.153 3.153 0 01-3.124-3.177A3.153 3.153 0 015.312 0a3.153 3.153 0 013.125 3.173 3.153 3.153 0 01-3.125 3.173zm0-5.077a1.9 1.9 0 101.875 1.9 1.892 1.892 0 00-1.875-1.904z"
            fill="#fff"
          />
        </ClipPath>
      </Defs>
      <G>
        <Circle cx={12.5} cy={12.5} r={12.5} fill="#f48a20" />
        <G data-name="Group 96">
          <Path
            data-name="Combined Shape"
            d="M16 18.692a.631.631 0 01-.625-.635v-1.269a1.892 1.892 0 00-1.875-1.903H9.125a1.892 1.892 0 00-1.875 1.9v1.269a.631.631 0 01-.625.635.631.631 0 01-.625-.631v-1.27a3.153 3.153 0 013.125-3.173H13.5a3.153 3.153 0 013.125 3.173v1.269a.631.631 0 01-.625.635zm2.5-4.442a.631.631 0 01-.625-.635v-1.269h-1.25a.635.635 0 010-1.269h1.25V9.808a.625.625 0 111.25 0v1.269h1.25a.635.635 0 010 1.269h-1.25v1.269a.631.631 0 01-.625.635zm-7.188-1.9a3.153 3.153 0 01-3.124-3.177A3.153 3.153 0 0111.312 6a3.153 3.153 0 013.125 3.173 3.153 3.153 0 01-3.125 3.173zm0-5.077a1.9 1.9 0 101.875 1.9 1.892 1.892 0 00-1.875-1.904z"
            fill="#fff"
          />
          <G
            data-name="Mask Group 96"
            clipPath="url(#add-user_svg__a)"
            transform="translate(6 6)"
          >
            <Path
              fill="#fff"
              d="M0-1.269h15v15.231H0z"
              data-name="\uD83C\uDFA8Color"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgAddUser;