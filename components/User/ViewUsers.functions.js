import firebase from 'react-native-firebase'
import { Alert } from 'react-native'
export const makeTeamLead = function (memberid) {
    const memberData = this.state.ProjectData.teammembers[memberid]
    this.state.ProjectData.teamleads[memberid] = memberData
    delete this.state.ProjectData.teammembers[memberid]
    firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).set(this.state.ProjectData)
    this.setState({ refresh: true })
}

export const removefromProject = function (identifier, id) {
    Alert.alert(
        'Remove!',
        'Are you sure to want to remove this user from this Project ?',
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            {
                text: 'OK', onPress: () => {
                    if (identifier === 'teamleads') {
                        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teamleads').child(id).remove()
                        delete this.state.ProjectData.teamleads[id]
                        this.setState({ refresh: true })
                    } else if (identifier === 'teammembers') {
                        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(id).remove()
                        delete this.state.ProjectData.teammembers[id]
                        this.setState({ refresh: true })
                    }
                }
            },
        ],
        { cancelable: true },
    )
}
export const Demote = function (id) {
    Alert.alert(
        'Demote!',
        'Are you sure to want to demote this user on this Project ?',
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            {
                text: 'OK', onPress: () => {
                    const memberData = this.state.ProjectData.teamleads[id]
                    this.state.ProjectData.teammembers[id] = memberData
                    delete this.state.ProjectData.teamleads[id]
                    firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).set(this.state.ProjectData)
                    this.setState({ refresh: true })
                }
            },
        ],
        { cancelable: true },
    )
    // firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(id).set(this.state.ProjectData.teamleads[id])
}