import React from 'react'
import { Text, View, Image, Dimensions, Platform, ImageBackground } from 'react-native'
import {
    Container, Content, Header, Footer, Left, Right, Body, Icon, Button, Badge, Title,
    FooterTab, Card, CardItem
} from 'native-base'
import { connect } from 'react-redux'
import { SetActiveProjectId, SetActiveIssue } from '../../redux/actions'
class IssuesIndex extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
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
            <Container>
                <ImageBackground source={require('../../assets/splash-bg.jpg')}
                    style={{ width: width, height: height }}>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                                <Icon name="arrow-back" style={{ color: 'blue' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: 'black' }}>Issues Index</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content padder>
                        {this.props.issues.map(_issue => {
                            return (
                                <Card style={{ flex: 1, marginBottom: 10 }} key={_issue.issueId}>
                                    <CardItem header bordered button onPress={() => alert("This is Card Header")}>
                                        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>{_issue.issueTitle}</Text>
                                    </CardItem>
                                    <CardItem button bordered>
                                        <Body style={{ flex: 1, flexDirection: 'row' }}>
                                            <Left><Text>Project Name #</Text></Left>
                                            <Right><Text>{this.props.projectData[_issue.projectId].projectTitle}</Text></Right>
                                        </Body>
                                    </CardItem>
                                    <CardItem footer button style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }} onPress={() => { this.handleNavigation(_issue.projectId, _issue.issueId) }}>
                                        <Text style={{ color: 'blue', fontStyle: 'italic' }}>View More</Text>
                                    </CardItem>
                                </Card>
                            )
                        })}
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button badge vertical onPress={() => { this.props.navigation.navigate('Dashboard') }}>
                                <Badge><Text>{this.props.projectsCount}</Text></Badge>
                                <Icon name="project" type="Octicons" />
                                <Text>Projects</Text>
                            </Button>
                            <Button vertical onPress={() => { this.props.navigation.navigate('UserProfile') }}>
                                <Icon name="user" type="AntDesign" />
                                <Text>User</Text>
                            </Button>
                            <Button active badge vertical>
                                <Badge ><Text>{this.props.issuesCount}</Text></Badge>
                                <Icon name="issue-opened" type="Octicons" />
                                <Text>Issues</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </ImageBackground>
            </Container>
        )
    }
}
const mapStateToProps = state => {
    const TitleToId = {}
    state.projectReducer.projectDetails.forEach(_project => {
        TitleToId[_project.projectId] = _project
    })
    return {
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