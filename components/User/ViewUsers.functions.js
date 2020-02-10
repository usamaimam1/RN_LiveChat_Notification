import firebase from 'react-native-firebase'
import { Alert } from 'react-native'
export const makeTeamLead = function (memberid) {
    const memberData = this.props.ProjectData.teammembers[memberid]
    const projectId = this.props.navigation.state.params.projectId
    firebase.database().ref('Projects').child(projectId).child('teammembers').child(memberid).remove()
    firebase.database().ref('Projects').child(projectId).child('teamleads').child(memberid).set(memberData, () => {
        this.props.setActiveProjectId(projectId)
    })
}

export const removefromProject = function (identifier, id) {
    Alert.alert('Remove!', 'Are you sure to want to remove this user from this Project ?',
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            {
                text: 'OK', onPress: () => {
                    if (identifier === 'teamleads') {
                        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teamleads').child(id).remove(() => {
                            this.props.setActiveProjectId(this.props.ProjectData.projectId)
                        })
                    } else if (identifier === 'teammembers') {
                        firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(id).remove(() => {
                            this.props.setActiveProjectId(this.props.ProjectData.projectId)
                        })
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
                    const { projectId } = this.props.navigation.state.params
                    const memberData = this.props.ProjectData.teamleads[id]
                    firebase.database().ref('Projects').child(projectId).child('teamleads').child(id).remove()
                    firebase.database().ref('Projects').child(projectId).child('teammembers').child(id).set(memberData, () => {
                        this.props.setActiveProjectId(projectId)
                    })

                }
            },
        ],
        { cancelable: true },
    )
    // firebase.database().ref('Projects').child(this.props.navigation.state.params.projectId).child('teammembers').child(id).set(this.state.ProjectData.teamleads[id])
}