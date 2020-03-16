import React from 'react'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Title,
    Card, CardItem, Badge, FooterTab
} from 'native-base'
import { Image, View, Text, ImageBackground, Dimensions, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as SvgIcons from '../../assets/SVGIcons/index'
import { connect } from 'react-redux'
class UserProfile extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            imagePicked: false,
            imageUploaded: false,
            profilepic: this.props.user.profilepic
        }
        // this.handlePickImage = handlePickImage.bind(this)
        // this.handleUpdate = handleUpdate.bind(this)
    }
    componentDidMount() {

    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        return (
            <SafeAreaView style={styles.Container}>
                <View style={styles.Header}>
                    <View style={styles.HeaderInnerView} >
                        <SvgIcons.Back height={hp(2.9)} width={wp(6.4)} color="#34304C" onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                        <Text style={styles.HeaderTitle}>User Profile</Text>
                    </View>
                </View>
                <View style={styles.ProfileView}>
                    <View style={styles.ProfileInnerUpperView}>
                    </View>
                    <Image source={{ uri: this.state.profilepic }} style={styles.Avatar}>
                    </Image>
                    <View style={styles.ProfileInnerLowerView}>
                        <View style={styles.StatusView}>
                            <Text style={styles.StatusText}>{this.props.user ? this.props.user.adminaccess ? "Admin" : "Employee" : ""}</Text>
                        </View>
                        <View style={styles.NameEmailView} >
                            <Text style={styles.Name}>{this.props.user.fullName}</Text>
                            <Text style={styles.Email}>{this.props.user.email}</Text>
                        </View>
                        <View style={styles.NameEmailDivider}></View>
                        <View style={styles.InfoView}>
                            <View style={styles.InfoRow}>
                                <Text style={styles.InfoText}>{this.props.projectCount}</Text>
                                <Text style={styles.InfoLabel}>Projects</Text>
                            </View>
                            <View style={[styles.InfoRow, { marginLeft: wv(32) }]}>
                                <Text style={styles.InfoText}>{this.props.issueCount}</Text>
                                <Text style={styles.InfoLabel}>Issues</Text>
                            </View>
                            <View style={[styles.InfoRow, { marginLeft: wv(46) }]}>
                                <Text style={styles.InfoText}>{this.props.projectCount}</Text>
                                <Text style={styles.InfoLabel}>Teams</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.UpdateButton} onPress={() => { this.props.navigation.navigate('EditUserProfile') }}>
                            <Text style={styles.UpdateButtonText}>UPDATE</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    Container: {
        shadowColor: "#000", shadowOpacity: 0.16
    },
    Header: {
        height: hp(8.3), borderBottomColor: 'grey', borderBottomWidth: 1
    },
    HeaderInnerView: {
        height: hp(2.9), marginVertical: hp(3.2), marginHorizontal: wp(3.0), flexDirection: 'row'
    },
    HeaderTitle: {
        marginLeft: wp(4.533), fontSize: RFValue(14), color: '#34304C', fontWeight: "500"
    },
    ProfileView: { height: hv(396), width: wv(345), marginTop: hv(20.5), marginHorizontal: wv(15), borderWidth: 0, },
    Avatar: { height: hv(124), width: hv(124), borderRadius: hv(124) / 2, alignSelf: 'center', position: 'absolute' },
    ProfileInnerUpperView: { height: hv(60), backgroundColor: '#FBFCFE' },
    ProfileInnerLowerView: { position: 'absolute', height: hv(336), width: wv(345), marginTop: hv(60), borderWidth: 0 },
    StatusView: { height: hv(25), width: wv(64), alignSelf: 'center', marginTop: hv(79.5), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    StatusText: { fontSize: RFValue(12), fontWeight: '500', },
    NameEmailView: { alignSelf: 'center', width: wv(190), height: hv(56), marginTop: hv(11.5) },
    Name: { fontSize: RFValue(26), alignSelf: 'center' },
    Email: { fontSize: RFValue(14), color: '#758692', alignSelf: 'center', marginTop: hv(6) },
    NameEmailDivider: { borderBottomColor: '#D4DCE1', borderBottomWidth: 1, marginHorizontal: wv(20), marginTop: hv(17) },
    InfoView: { alignSelf: 'center', width: wv(254), height: hv(45), marginTop: hv(13.5), flexDirection: 'row' },
    InfoRow: { width: wv(58), height: hv(45) },
    InfoText: { alignSelf: 'center', fontSize: RFValue(18), fontWeight: 'bold' },
    InfoLabel: { marginTop: hv(5), fontSize: RFValue(14), color: '#758692', alignSelf: 'center' },
    UpdateButton: { alignSelf: 'center', width: wv(100), height: hv(32), borderRadius: hv(32) / 2, marginTop: hv(26.5), backgroundColor: '#F48A20' },
    UpdateButtonText: { color: 'white', textAlign: 'center', fontSize: RFValue(13), marginVertical: hv(8), marginHorizontal: wv(22), fontWeight: '500' }


})
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        projectCount: state.projectReducer.projectDetails.length,
        issueCount: state.issuesReducer.issuesCount
    }
}
export default connect(mapStateToProps, null)(UserProfile)