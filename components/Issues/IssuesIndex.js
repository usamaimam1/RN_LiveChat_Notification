import React from 'react'
import { Text, View, Image, Dimensions, Platform, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Badge, Title,
    FooterTab, Card, CardItem
} from 'native-base'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import * as SvgIcons from '../../assets/SVGIcons/index'
import { connect } from 'react-redux'
import { SetActiveProjectId, SetActiveIssue } from '../../redux/actions'
class IssuesIndex extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.activeColor = "#34304C"
        this.inActiveColor = "#77869E"
        this.handleNavigation = this.handleNavigation.bind(this)
    }
    handleNavigation(_project, _issue) {
        this.props.setActiveProjectData(_project)
        this.props.setActiveIssueId(_issue)
        this.props.navigation.navigate('IssueScreen', { projectId: _project, IssueId: _issue })
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
                        <Text style={styles.HeaderTitle}>Issues Index</Text>
                    </View>
                </View>
                <View style={styles.IssuesView}>
                    {this.props.issues.map((_issue, index) => {
                        return index === 0 ?
                            <TouchableOpacity key={_issue.issueId} style={styles.IssueList} onPress={() => { this.handleNavigation(_issue.projectId, _issue.issueId) }}>
                                <View style={styles.IssueIconView}>
                                    <SvgIcons.Issue width={wv(26)} height={hv(26)} style={styles.IssueIcon}></SvgIcons.Issue>
                                </View>
                                <View style={styles.IssueInfo}>
                                    <Text style={styles.IssueName}>{_issue.issueTitle}</Text>
                                    <Text style={styles.ProjectName}>{this.props.projectData[_issue.projectId].projectTitle}</Text>
                                </View>
                            </TouchableOpacity> :
                            <TouchableOpacity key={_issue.issueId} style={[styles.IssueList, { marginTop: hv(12.5) }]} onPress={() => { this.handleNavigation(_issue.projectId, _issue.issueId) }}>
                                <View style={styles.IssueIconView}>
                                    <SvgIcons.Issue width={wv(26)} height={hv(26)} style={styles.IssueIcon}></SvgIcons.Issue>
                                </View>
                                <View style={styles.IssueInfo}>
                                    <Text style={styles.IssueName}>{_issue.issueTitle}</Text>
                                    <Text style={styles.ProjectName}>{this.props.projectData[_issue.projectId].projectTitle}</Text>
                                </View>
                            </TouchableOpacity>
                    })}
                </View>
                {
                    this.props.user ? this.props.user.adminaccess ?
                        <View style={styles.Footer}>
                            <View style={styles.ProjectsIcon} onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsCount}</Text>
                                </View>
                                <SvgIcons.Projects style={{ alignSelf: 'center', borderWidth: 0 }} width={wv(30)} height={hv(30)} color={this.inActiveColor} onPress={() => { this.props.navigation.navigate('Dashboard') }}></SvgIcons.Projects>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Projects</Text>
                            </View>
                            <View style={{ width: wv(38), height: hv(42), marginTop: hv(25) + RFValue(16), marginLeft: wv(33), borderWidth: 0 }}>
                                <SvgIcons.Users width={wv(19.5)} height={hv(22)} color={this.activeColor} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('UserProfile') }} ></SvgIcons.Users>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Profile</Text>
                            </View>
                            <View style={{ width: wv(52), height: wv(52), borderWidth: 0, marginLeft: wv(13.5) }}>
                                <SvgIcons.AddProject width={wv(52)} height={wv(52)} color="white" style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddProject') }}></SvgIcons.AddProject>
                            </View>
                            <View style={{ width: wv(52), height: hv(44), marginLeft: wv(13.5), marginTop: hv(23) + RFValue(16), borderWidth: 0 }}>
                                <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }}></SvgIcons.AddUserFooter>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Add User</Text>
                            </View>
                            <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                                <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text>
                                </View>
                                <SvgIcons.IssueFooterActive width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { }}></SvgIcons.IssueFooterActive>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.activeColor }}>Issues</Text>
                            </View>
                        </View> :
                        <Footer transparent style={{ backgroundColor: 'white', marginTop: hv(10) }}>
                            <FooterTab style={{ backgroundColor: 'white' }}>
                                <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                    <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.projectsCount}</Text>
                                    </Badge>
                                    <SvgIcons.Projects width={RFValue(26)} height={RFValue(26)} color="#34304C"></SvgIcons.Projects>
                                    <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', color: this.inActiveColor }}>Projects</Text>
                                </Button>
                                <Button vertical badge onPress={() => { this.props.navigation.navigate('UserProfile') }}>
                                    <Badge style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}><Text style={{ color: 'rgba(255, 255, 255, 0.1)' }}>{this.props.projectsLength}</Text></Badge>
                                    <SvgIcons.Users width={RFValue(26)} height={RFValue(26)} ></SvgIcons.Users>
                                    <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Profile</Text>
                                </Button>
                                <Button badge vertical title="" onPress={() => { }} >
                                    <Badge style={{ height: RFValue(16), width: RFValue(16), backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                        <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text></Badge>
                                    <SvgIcons.IssueFooterActive width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooterActive>
                                    <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.activeColor }}>Issues</Text>
                                </Button>
                            </FooterTab>
                        </Footer> : null
                }
            </SafeAreaView >
        )
    }
}
const mapStateToProps = state => {
    const TitleToId = {}
    state.projectReducer.projectDetails.forEach(_project => {
        TitleToId[_project.projectId] = _project
    })
    return {
        user: state.userReducer.user,
        projectsCount: state.projectReducer.projectDetails.length,
        issuesCount: state.issuesReducer.issuesCount,
        issues: state.issuesReducer.issueDetails.filter(_issue => state.projectReducer.relevantProjectIds.includes(_issue.projectId)),
        projectData: TitleToId
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setActiveProjectData: function (projectId) { dispatch(SetActiveProjectId(projectId)) },
        setActiveIssueId: function (issueId) { dispatch(SetActiveIssue(issueId)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(IssuesIndex)

const styles = StyleSheet.create({
    Container: {
        flex: 1, shadowColor: "#000", shadowOpacity: 0.16
    },
    Header: {
        height: hp(8.3), borderBottomColor: 'grey', borderBottomWidth: 0
    },
    HeaderInnerView: {
        height: hp(2.9), marginVertical: hp(3.2), marginHorizontal: wp(3.0), flexDirection: 'row'
    },
    HeaderTitle: {
        marginLeft: wp(4.533), fontSize: RFValue(12), color: '#34304C', fontFamily: "Montserrat",
    },
    IssuesView: { flex: 1, marginTop: hv(36), marginHorizontal: wv(15), borderWidth: 0 },
    IssueList: { width: wv(345.5), height: hv(45), flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#D4DCE1' },
    IssueIconView: { justifyContent: 'center', alignItems: 'center' },
    IssueIcon: { alignSelf: 'center', marginBottom: hv(5) },
    IssueInfo: { height: hv(34), marginBottom: hv(12.5), marginLeft: wv(10), borderWidth: 0, flex: 1 },
    IssueName: { fontFamily: "Montserrat", fontSize: RFValue(13), fontWeight: "400" },
    ProjectName: { fontFamily: "Montserrat", fontSize: RFValue(12), color: '#758692', marginTop: hv(3) },
    Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row' },
    ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },
})