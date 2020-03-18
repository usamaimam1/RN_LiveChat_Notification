import React from 'react'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Title,
    Card, CardItem, Badge, FooterTab
} from 'native-base'
import {
    Image, View, Text, ImageBackground, Dimensions, TouchableOpacity, StyleSheet, SafeAreaView
} from 'react-native'
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
        this.activeColor = "#34304C"
        this.inActiveColor = "#77869E"
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
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.user) {
            if (nextProps.user.profilepic !== prevState.profilepic) {
                return { profilepic: nextProps.user.profilepic }
            }
        }
        return null
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
                            <Text numberOfLines={1} style={styles.Name}>{this.props.user.fullName}</Text>
                            <Text numberOfLines={1} style={styles.Email}>{this.props.user.email}</Text>
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
                {this.props.user ? this.props.user.adminaccess ?
                    <View style={styles.Footer}>
                        <View style={styles.ProjectsIcon} onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                            <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectCount}</Text>
                            </View>
                            <SvgIcons.Projects style={{ alignSelf: 'center', borderWidth: 0 }} width={wv(30)} height={hv(30)} color={this.inActiveColor} onPress={() => { this.props.navigation.navigate('Dashboard') }}></SvgIcons.Projects>
                            <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Projects</Text>
                        </View>
                        <View style={{ width: wv(38), height: hv(42), marginTop: hv(25) + RFValue(16), marginLeft: wv(33), borderWidth: 0 }}>
                            <SvgIcons.UsersActive width={wv(19.5)} height={hv(22)} color={this.activeColor} style={{ alignSelf: 'center' }} onPress={() => { }} ></SvgIcons.UsersActive>
                            <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.activeColor }}>Profile</Text>
                        </View>
                        <View style={{ width: wv(52), height: wv(52), borderWidth: 0, marginLeft: wv(13.5) }}>
                            <SvgIcons.AddProject width={wv(52)} height={wv(52)} color="white" style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddProject') }}></SvgIcons.AddProject>
                        </View>
                        <View style={{ width: wv(52), height: hv(44), marginLeft: wv(13.5), marginTop: hv(23) + RFValue(16), borderWidth: 0 }}>
                            <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }}></SvgIcons.AddUserFooter>
                            <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Add User</Text>
                        </View>
                        <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                            <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issueCount}</Text>
                            </View>
                            <SvgIcons.IssueFooter width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('IssuesIndex') }}></SvgIcons.IssueFooter>
                            <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Issues</Text>
                        </View>
                    </View> :
                    <Footer style={{ backgroundColor: 'white', marginTop: hv(226.5) }}>
                        <FooterTab>
                            <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectCount}</Text>
                                </Badge>
                                <SvgIcons.Projects width={RFValue(26)} height={RFValue(26)} color="#34304C"></SvgIcons.Projects>
                                <Text style={{ fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', color: this.inActiveColor }}>Projects</Text>
                            </Button>
                            <Button vertical badge onPress={() => { }}>
                                <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}><Text style={{ color: 'rgba(255, 255, 255, 0.1)' }}>{this.props.projectCount}</Text></Badge>
                                <SvgIcons.UsersActive width={RFValue(26)} height={RFValue(26)} ></SvgIcons.UsersActive>
                                <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.activeColor }}>Profile</Text>
                            </Button>
                            <Button badge vertical title="" onPress={() => { this.props.navigation.navigate('IssuesIndex') }} >
                                <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issueCount}</Text></Badge>
                                <SvgIcons.IssueFooter width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooter>
                                <Text style={{ fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Issues</Text>
                            </Button>
                        </FooterTab>
                    </Footer> : null
                }
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    Container: {
        shadowColor: "#000", shadowOpacity: 0.16
    },
    Header: {
        height: hp(8.3), borderBottomColor: 'grey', borderBottomWidth: 0
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
    NameEmailView: { alignSelf: 'center', height: hv(56), marginTop: hv(11.5) },
    Name: { fontSize: RFValue(26), alignSelf: 'center' },
    Email: { fontSize: RFValue(14), color: '#758692', alignSelf: 'center', marginTop: hv(6) },
    NameEmailDivider: { borderBottomColor: '#D4DCE1', borderBottomWidth: 1, marginHorizontal: wv(20), marginTop: hv(17) },
    InfoView: { alignSelf: 'center', width: wv(254), height: hv(45), marginTop: hv(13.5), flexDirection: 'row' },
    InfoRow: { width: wv(58), height: hv(45) },
    InfoText: { alignSelf: 'center', fontSize: RFValue(18), fontWeight: 'bold' },
    InfoLabel: { marginTop: hv(5), fontSize: RFValue(14), color: '#758692', alignSelf: 'center' },
    UpdateButton: { alignSelf: 'center', width: wv(100), height: hv(32), borderRadius: hv(32) / 2, marginTop: hv(26.5), backgroundColor: '#F48A20' },
    UpdateButtonText: { color: 'white', textAlign: 'center', fontSize: RFValue(13), marginVertical: hv(8), marginHorizontal: wv(22), fontWeight: '500' },
    Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row', marginTop: hv(197.5) },
    ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },

})
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        projectCount: state.projectReducer.projectDetails.length,
        issueCount: state.issuesReducer.issuesCount
    }
}
export default connect(mapStateToProps, null)(UserProfile)