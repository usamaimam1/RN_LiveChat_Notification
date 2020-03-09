import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const FRAME_WIDTH = 375
const FRAME_HEIGHT = 812
export const widthPercentage = (width) => {
    return wp(width / FRAME_WIDTH * 100)
}
export const heightPercentage = (height) => {
    return hp(height / FRAME_HEIGHT * 100)
}