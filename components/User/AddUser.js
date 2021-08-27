import React from 'react'
import {
    Container, Content, Header, Footer, FooterTab, Badge, Item, Input, Text, Button, Icon,
    List, ListItem, Left, Right, Body, Thumbnail, Title, Subtitle
} from 'native-base'
import firebase from 'react-native-firebase'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentage as wv, heightPercentage as hv } from '../../util/stylerHelpers'
import * as SvgIcons from '../../assets/SVGIcons/index'
import { ImageBackground, Dimensions, Alert, View, SafeAreaView, StyleSheet, Image, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { SetSearchString, ResetSearchString, SetActiveProjectId } from '../../redux/actions'
import Svg from 'react-native-svg';
class AddUser extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            projectId: this.props.navigation.state.params.projectId,
            searchString: '',
            ids: [],
            results: [],
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.evalMemberShip = this.evalMemberShip.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
    }
    componentDidMount() {

    }
    handleAdd(user) {
        firebase.database().ref('Projects').child(this.state.projectId).child('teammembers').child(user.uid)
            .set({ isAllowed: true, fullName: user.fullName, profilepic: user.profilepic, uid: user.uid }, () => {
                Alert.alert('Success!', 'User has been added successfully!',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { } },
                    ],
                    { cancelable: true },
                )
                this.props.setActiveProjectId(this.state.projectId)
                this.setState({ searchString: '' })
            })
    }
    evalMemberShip(id) {
        const isProjectManager = this.props.project.projectmanager[id]
        const isTeamLead = this.props.project.teamleads ? this.props.project.teamleads[id] : false
        const isTeamMember = this.props.project.teammembers ? this.props.project.teammembers[id] : false
        return (isProjectManager || isTeamLead || isTeamMember)
    }
    handleSearch(query) {
        this.setState({ searchString: query })
        if (query.length > 2) {
            this.props.setSearchString(query)
        }
    }
    render() {
        const width = Dimensions.get("window").width
        const height = Dimensions.get("window").height
        console.log(this.state.searchString.length)
        return (
            <SafeAreaView style={styles.Container}>
                <View style={styles.Header}>
                    <SvgIcons.Back width={wv(24)} height={hv(24)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.goBack() }}></SvgIcons.Back>
                    <Item style={styles.SearchBar}>
                        <Input style={styles.SearchString} placeholder='Search Here...' value={this.state.searchString} onChangeText={newText => { this.handleSearch(newText) }} />
                        <SvgIcons.Search width={wv(16)} height={hv(16)} style={{}}></SvgIcons.Search>
                    </Item>
                </View>
                <ScrollView style={styles.SearchResultsView}>
                    {this.props.searchResults.length === 0 ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: "Montserrat", textAlign: 'center', margin: 20 }}>{this.state.searchString.length == 0 ? null : "No Records Found"}</Text>
                        </View> :
                        this.props.searchResults.map(_result => {
                            return (
                                <View key={_result.uid} style={styles.SearchResult}>
                                    <Image source={{ uri: _result.profilepic }} style={styles.Avatar} resizeMode="cover"></Image>
                                    <View style={styles.InfoView}>
                                        <Text style={styles.Name}>{_result.fullName}</Text>
                                        <Text style={styles.Status}>{_result.adminaccess ? "Admin" : "Employee"}</Text>
                                    </View>
                                    {this.evalMemberShip(_result.uid) ?
                                        <SvgIcons.UserAdded width={wv(25)} height={hv(25)} style={{ alignSelf: 'center' }}></SvgIcons.UserAdded> :
                                        <SvgIcons.AddUser width={wv(25)} height={hv(25)} style={{ alignSelf: 'center' }} onPress={() => { this.handleAdd(_result) }}></SvgIcons.AddUser>
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>
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
                                <SvgIcons.AddUserFooter width={wv(26)} height={hv(26)} style={{ alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('AddUser', { projectId: this.state.projectId }) }}></SvgIcons.AddUserFooter>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(6), color: this.inActiveColor }}>Add User</Text>
                            </View>
                            <View style={{ width: wv(34), height: hv(47), marginLeft: wv(35), marginTop: hv(20) }}>
                                <View style={{ height: RFValue(16), width: RFValue(16), alignSelf: 'flex-start', backgroundColor: '#F48A20', borderRadius: RFValue(10), borderWidth: 0 }}>
                                    <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(11), alignSelf: 'center', color: 'white' }}>{this.props.issuesCount}</Text>
                                </View>
                                <SvgIcons.IssueFooter width={wv(30)} height={hv(30)} style={{ alignSelf: 'center' }} onPress={() => { }}></SvgIcons.IssueFooter>
                                <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), marginTop: hv(3), alignSelf: 'center', borderWidth: 0, color: this.inActiveColor }}>Issues</Text>
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
                                    <SvgIcons.IssueFooter width={RFValue(26)} height={RFValue(26)}></SvgIcons.IssueFooter>
                                    <Text style={{ fontFamily: "Montserrat", fontSize: RFValue(10), alignSelf: 'center', borderWidth: 0, marginTop: hv(3), color: this.inActiveColor }}>Issues</Text>
                                </Button>
                            </FooterTab>
                        </Footer> : null
                }
            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        project: state.projectReducer.activeProjectData.length === 1 ? state.projectReducer.activeProjectData[0] : null,
        searchResults: state.searchReducer.searchResults,
        projectsCount: state.projectReducer.projectDetails.length,
        issuesCount: state.issuesReducer.issuesCount
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setSearchString: function (query) { dispatch(SetSearchString(query)) },
        resetSearchString: function () { dispatch(ResetSearchString()) },
        setActiveProjectId: function (id) { dispatch(SetActiveProjectId(id)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddUser)

const styles = StyleSheet.create({
    Container: { flex: 1 },
    Header: { height: hv(70), marginVertical: hv(15.5), marginHorizontal: wv(12), borderWidth: 0, flexDirection: 'row' },
    SearchBar: { marginLeft: wv(17), height: hv(18), flex: 1, alignSelf: 'center' },
    SearchString: { fontSize: RFValue(14), color: '#34304C', fontFamily: "Montserrat", },
    SearchResultsView: { flex: 1, borderWidth: 0 },
    SearchResult: { height: hv(72.5), marginHorizontal: wv(15), borderWidth: 0, marginTop: hv(26), flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#D4DCE1' },
    Avatar: { width: RFValue(55), height: RFValue(55), borderRadius: RFValue(55) / 2, alignSelf: 'center' },
    InfoView: { alignSelf: 'center', height: hv(38), marginLeft: wv(11), borderWidth: 0, flex: 1 },
    Name: { fontSize: RFValue(14), fontWeight: "600", fontFamily: "Montserrat", },
    Status: { fontSize: RFValue(13), color: "#758692", marginTop: hv(4), fontFamily: "Montserrat", },
    Footer: { height: hv(94.5), width: wv(375), borderWidth: 0, flexDirection: 'row' },
    ProjectsIcon: { width: wv(47), height: hv(47), marginTop: hv(20), marginLeft: wv(27), borderWidth: 0 },
})