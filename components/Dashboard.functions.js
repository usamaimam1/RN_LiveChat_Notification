import firebase from 'react-native-firebase'
import { Toast } from 'native-base'
export const filterRelevantProjects = function (project) {
    const isProjectManager = project.projectmanager[this.User.uid] ? true : false
    const isTeamLead = project.teamleads ? project.teamleads[this.User.uid] ? true : false : false
    const isTeamMember = project.teammembers ? project.teammembers[this.User.uid] ? true : false : false
    return isProjectManager || isTeamLead || isTeamMember
}

export const preFetchFunc = function () {
    const projRef = firebase.database().ref('Projects')
    projRef.once('value').then(data => {
        if (data._value) {
            const ProjectVals = Object.keys(data._value).map(_key => data._value[_key]).filter(this.filterRelevantProjects)
            this.props.addprojects(ProjectVals)
            this.props.setRelevantProjectIds(ProjectVals.map(_project => _project.projectId))
            let issueCount = 0
            ProjectVals.forEach(_project => {
                issueCount += _project.issues ? Object.keys(_project.issues).length : 0
            })
            this.props.setIssuesCount(issueCount)
        }
        this.enableAddandRemoveListeners()
        this.setState({ projectAdded: true })
    }).catch(err => {
        console.log(err)
        this.enableAddandRemoveListeners()
        this.setState({ projectAdded: true })
    })
}

export const enableAddandRemoveListeners = function () {
    let userAdded = false
    let projectAdded = false
    let issuesAdded = false
    let usersAdded = false
    this._userRef = firebase.database().ref("users").child(this.User.uid)
    this._userRef.on('value', data => {
        console.log(data._value)
        if (data.val()) {
            this.props.adduser(data._value)
            this.setState({
                status: data._value.adminaccess ? 'Admin' : 'Employee',
                iconSource: { uri: data._value.profilepic, cache: 'force-cache' },
                userAdded: true
            })
        }
    })
    this._projectchildaddedref = firebase.database().ref('Projects')
    this._projectchildaddedref.on('child_changed', data => {
        if (data.val()) {
            const isIncluded = this.props.projects.filter(project => project.projectId === data.val().projectId)
            const isRelevant = isIncluded.length === 0 ? this.filterRelevantProjects(data._value) : false
            if (isRelevant) {
                this.props.addproject(data._value)
                this.props.addRelevantProject(data._value.projectId)
                this.props.setIssuesCount(this.props.issueCount + (data._value.issues ? Object.keys(data._value.issues).length : 0))
            }
            if (isIncluded.length > 0) {
                let oldProjectData = this.props.projects.find(project => project.projectId === data._value.projectId)
                let oldIssuesCount = oldProjectData.issues ? Object.keys(oldProjectData.issues).length : 0
                let newIssuesCount = data._value.issues ? Object.keys(data._value.issues).length : 0
                if (oldIssuesCount !== newIssuesCount) {
                    this.props.setIssuesCount(this.props.issueCount + (newIssuesCount - oldIssuesCount))
                    console.log('Issues Count called in child_changed')
                }
                this.props.setproject(data._value.projectId, data._value)
                if (this.props.activeProjectId === data._value.projectId) {
                    this.props.setActiveProjectId(data._value.projectId)
                }
            }
        }
        this.setState({ projectAdded: true })
    })
    this._projectchildremoveref = firebase.database().ref('Projects')
    this._projectchildremoveref.on('child_removed', data => {
        if (data.val()) {
            this.props.deleteproject(data._value.projectId)
            const newIssuesNumber = data._value.issues ? Object.keys(data._value.issues).length : 0
            this.props.setIssuesCount(this.props.issueCount - newIssuesNumber)
            console.log('Issues Count called in child_removed')
        }
    })
    this._issuesAddandRemove = firebase.database().ref('Issues')
    this._issuesAddandRemove.on('value', data => {
        if (data._value) {
            this.props.addIssues(Object.keys(data._value).map(_key => data._value[_key]))
        }
        this.setState({ issuesAdded: true })
    })
    this._usersListener = firebase.database().ref('users')
    this._usersListener.on('value', data => {
        console.log(data)
        if (data._value) {
            // console.log(data._value)
            this.props.addUsers(Object.keys(data._value).map(_key => data._value[_key]))
        }
        this.setState({ usersAdded: true })
    })
}
export const disableAddandRemoveListeners = function () {
    this._userRef.off('value')
    this._projectchildaddedref.off('child_added')
    this._projectchildremoveref.off('child_removed')
    this._issuesAddandRemove.off('value')
    this._usersListener.off('value')
}
export const handleBackPress = function () {
    Toast.show({ text: 'Button Pressed', buttonText: 'Okay' })
    return true
}
export const formatDate = function (date) {
    var monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY",
        "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
export const handleSignOut = function () {
    firebase.auth().signOut().then(() => {
        this.props.resetUser()
        this.props.resetProjects()
        this.props.resetIssues()
        this.props.resetSearchString()
        this.props.resetUsers()
        this.props.navigation.navigate('Loading')
    }).catch((err) => {
        Toast.show({ text: err.message, buttonText: "OK" })
    })
}
export const handleChangePassword = function () {
    this.props.navigation.navigate('ChangePassword')
}
export const openDrawer = function () {
    this._drawer._root.open()
}
export const closeDrawer = function () {
    this._drawer._root.close()
}
export const handleDeleteProject = function (proj) {
    const ref = firebase.database().ref('Projects').child(proj.projectId)
    const projectThumbnail = proj.projectId
    firebase.storage().ref('projectThumbnails/' + projectThumbnail).delete().then(() => { })
        .catch(err => { console.log(err.message) })
    ref.remove().then(() => {
        this.setState({ refresh: null })
    })
    firebase.database().ref('Issues').orderByChild('projectId').equalTo(proj.projectId).once('value', data => {
        data._childKeys.forEach(i => { firebase.database().ref('Issues').child(i).remove() })
    })
    firebase.database().ref('Messages').child(proj.projectId).remove()
}