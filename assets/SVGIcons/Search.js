import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgSearch(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 16 15.999" {...props}>
      <Path
        d="M15.087 16l-4.595-4.524a6.4 6.4 0 01-8.831-.676 6.493 6.493 0 01.223-8.911 6.4 6.4 0 018.854-.224 6.493 6.493 0 01.667 8.888l4.597 4.527-.915.92zM6.45 1.316a5.181 5.181 0 00-3.635 8.832 5.091 5.091 0 003.635 1.516 5.174 5.174 0 000-10.348z"
        fill="#34304c"
      />
    </Svg>
  );
}

export default SvgSearch;
