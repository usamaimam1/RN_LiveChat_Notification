import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

function SvgProjectManagerB(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 25 25" {...props}>
      <G>
        <Circle cx={12.5} cy={12.5} r={12.5} fill="#34304c" />
        <Path
          d="M20 19.393H5V9.75a1.609 1.609 0 011.607-1.607h3.214V7.071A1.073 1.073 0 0110.893 6h3.214a1.073 1.073 0 011.071 1.071v1.072h3.214A1.609 1.609 0 0120 9.75v9.642zM6.071 12.428v5.893h12.858v-5.893h-1.072v2.144h-3.214v-2.144h-4.286v2.144H7.143v-2.144zm9.643 0V13.5h1.071v-1.072zm-7.5 0V13.5h1.072v-1.072zM6.607 9.214a.536.536 0 00-.536.536v1.607h12.858V9.75a.536.536 0 00-.536-.536zm4.286-2.143v1.072h3.214V7.071z"
          fill="#fff"
          data-name="Outlined/UI/briefcase"
        />
      </G>
    </Svg>
  );
}

export default SvgProjectManagerB;
