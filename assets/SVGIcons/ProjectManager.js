import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgProjectManager(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 30 26.786" {...props}>
      <Path
        d="M30 26.786H0V7.5a3.218 3.218 0 013.214-3.215h6.429V2.143A2.145 2.145 0 0111.786 0h6.429a2.145 2.145 0 012.143 2.143v2.142h6.429A3.218 3.218 0 0130 7.5v19.285zM2.143 12.857v11.786h25.714V12.857h-2.142v4.286h-6.429v-4.286h-8.572v4.286H4.285v-4.286zm19.286 0V15h2.143v-2.143zm-15 0V15h2.143v-2.143zM3.214 6.429A1.073 1.073 0 002.143 7.5v3.214h25.714V7.5a1.073 1.073 0 00-1.071-1.071zm8.572-4.286v2.142h6.429V2.143z"
        fill="#34304c"
      />
    </Svg>
  );
}

export default SvgProjectManager;
