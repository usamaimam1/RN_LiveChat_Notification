import firebase from 'react-native-firebase'
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
            const issueCount = ProjectVals.map(project => project.issues ? Object.keys(project.issues).length : 0).reduce((res, curr) => res + curr)
            this.props.setIssuesCount(issueCount)
        }
        this.enableAddandRemoveListeners()
    })
}

export const enableAddandRemoveListeners = function () {
    this._userRef = firebase.database().ref("users").child(this.User.uid)
    this.userfuncref = this._userRef.on('value', data => {
        if (data.val()) {
            this.props.adduser(data._value)
            this.setState({
                status: data._value.adminaccess ? 'Admin' : 'Employee',
                iconSource: { uri: data._value.profilepic, cache: 'force-cache' }
            })
        }
    })
    this._projectchildaddedref = firebase.database().ref('Projects')
    this._projectchildaddedref.on('child_added', data => {
        if (data.val()) {
            const isIncluded = this.props.projects.filter(project => project.projectId === data.val().projectId)
            const isRelevant = isIncluded.length === 0 ? this.filterRelevantProjects(data._value) : false
            if (isRelevant) {
                this.props.addproject(data._value)
            }
        }
    })
    this._projectchildremoveref = firebase.database().ref('Projects')
    this._projectchildremoveref.on('child_removed', data => {
        if (data.val()) {
            this.props.deleteproject(data._value.projectId)
        }
    })
    this._issuesAddandRemove = firebase.database().ref('Issues')
    this._issuesAddandRemove.on('value', data => {
        if (data._value) {
            this.props.addIssues(Object.keys(data._value).map(_key => data._value[_key]))
        }
    })
}
export const disableAddandRemoveListeners = function () {
    this._userRef.off('value')
    this._projectchildaddedref.off('child_added')
    this._projectchildremoveref.off('child_removed')
    this._issuesAddandRemove.off('value')
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
        this.props.navigation.navigate('Home')
    }).catch((err) => {
        ToastAndroid.show(err.message, ToastAndroid.LONG)
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