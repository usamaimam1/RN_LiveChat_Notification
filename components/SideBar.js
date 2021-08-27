import React from 'react'
import {
    Text, View, Platform, Dimensions, StyleSheet, Image, StatusBar,
    ImageBackground, Button, TouchableOpacity
} from 'react-native'
import {
    Content, Container, Header, Footer, Left, Body, Right,
    Icon, ListItem, List
} from 'native-base'
import { widthPercentage as wp, heightPercentage as hp } from '../util/stylerHelpers'
import { RFValue } from 'react-native-responsive-fontsize'
import * as SvgIcons from '../assets/SVGIcons/index'
export default class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: this.props._userData
        }
    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._userData !== prevState.userData) {
            return { userData: nextProps._userData }
        } else {
            return null
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.userData !== prevState.userData) {
            console.log((this.state))
            // this.setState({userData:this.state.})
        }
    }
    render() {
        return (
            <Container>
                <Content>
                    <View style={{ height: hp(100), width: wp(315), borderColor: 'red', borderWidth: 0 }}>
                        <Image style={{ width: RFValue(65), height: RFValue(65), borderRadius: RFValue(65) / 2, marginVertical: hp(17), marginHorizontal: wp(100) }} source={this.props.imgSrc} resizeMode="cover"></Image>
                    </View>
                    <View style={{ width: wp(275.4), height: hp(180.6), marginTop: hp(19), marginHorizontal: wp(15), borderWidth: 0, borderColor: 'green' }}>
                        {/* Profile Navigator */}
                        <TouchableOpacity style={{ flexDirection: 'row', height: hp(30) }} onPress={() => { this.props._navigation.navigate('UserProfile') }}>
                            <View>
                                <SvgIcons.Users width={wp(16)} height={hp(18.05)}></SvgIcons.Users>
                            </View>
                            <View style={{ marginLeft: wp(14), height: hp(30), borderBottomColor: '#D4DCE1', borderBottomWidth: 1, flex: 1 }}>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(13), color: '#758692' }}>Profile</Text>
                            </View>
                        </TouchableOpacity>
                        {/* Projects Navigator */}
                        <TouchableOpacity style={{ flexDirection: 'row', height: hp(30), marginTop: hp(11) }} onPress={() => { this.props._onClose() }}>
                            <View>
                                <SvgIcons.Projects width={wp(16)} height={hp(18.05)}></SvgIcons.Projects>
                            </View>
                            <View style={{ marginLeft: wp(14), height: hp(30), borderBottomColor: '#D4DCE1', borderBottomWidth: 1, flex: 1 }}>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(13), color: '#758692' }}>Projects</Text>
                            </View>
                        </TouchableOpacity>
                        {/* Issues Navigator */}
                        <TouchableOpacity style={{ flexDirection: 'row', height: hp(30), marginTop: hp(11) }} onPress={() => { this.props._navigation.navigate('IssuesIndex') }}>
                            <View>
                                <SvgIcons.IssueFooter width={wp(16)} height={hp(18.05)}></SvgIcons.IssueFooter>
                            </View>
                            <View style={{ marginLeft: wp(14), height: hp(30), borderBottomColor: '#D4DCE1', borderBottomWidth: 1, flex: 1 }}>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(13), color: '#758692' }}>Issues</Text>
                            </View>
                        </TouchableOpacity>
                        {/* Change Password */}
                        <TouchableOpacity style={{ flexDirection: 'row', height: hp(30), marginTop: hp(11) }} onPress={() => { this.props._onChangePassword() }}>
                            <View>
                                <SvgIcons.Password width={wp(16)} height={hp(18.05)}></SvgIcons.Password>
                            </View>
                            <View style={{ marginLeft: wp(14), height: hp(30), borderBottomColor: '#D4DCE1', borderBottomWidth: 1, flex: 1 }}>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(13), color: '#758692' }}>Change Password</Text>
                            </View>
                        </TouchableOpacity>
                        {/* Log Out */}
                        <TouchableOpacity style={{ flexDirection: 'row', height: hp(30), marginTop: hp(11) }} onPress={() => { this.props._onLogOut() }}>
                            <View>
                                <SvgIcons.Logout width={wp(16)} height={hp(18.05)}></SvgIcons.Logout>
                            </View>
                            <View style={{ marginLeft: wp(14), height: hp(30), borderBottomColor: '#D4DCE1', borderBottomWidth: 0, flex: 1 }}>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(13), color: '#758692' }}>Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        )
    }
}