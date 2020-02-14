import firebase from 'react-native-firebase'
import { Alert } from 'react-native'
import { Toast } from 'native-base'
export const fetchUserName = function (id) {
    const isProjectManager = this.props.project.projectmanager ? this.props.project.projectmanager[id] : false
    const isTeamLead = this.props.project.teamleads ? this.props.project.teamleads[id] : false
    if (isProjectManager) {
        return this.props.project.projectmanager[id].fullName
    } else if (isTeamLead) {
        return this.props.project.teamleads[id].fullName
    } else {
        return this.props.project.teammembers[id].fullName
    }
}
export const handleDelete = function () {
    const isProjectManager = this.props.project.projectmanager ? this.props.project.projectmanager[firebase.auth().currentUser.uid] : false
    const isTeamLead = this.props.project.teamleads ? this.props.project.teamleads[firebase.auth().currentUser.uid] : false
    if (isProjectManager || isTeamLead) {
        Alert.alert('Warning', 'Are you sure to want to delete this Issue?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
                {
                    text: 'OK', onPress: () => {
                        firebase.database().ref('Projects').child(this.state.projectId).child('issues').child(this.state.IssueId).remove()
                        firebase.database().ref('Issues').child(this.state.IssueId).remove()
                        firebase.database().ref('Messages').child(this.state.projectId).child(this.state.IssueId).remove()
                        Toast.show({
                            text: 'Issue has been deleted Successfully', buttonText: 'Ok',
                        })
                        this.props.navigation.pop()
                    }
                },
            ],
            { cancelable: false },
        );
    }
}
export const isCloseToBottom = function (nativeEvent) {
    const paddingToBottom = 20;
    return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - paddingToBottom
};
export const isCloseToTop = function (nativeEvent) {
    return nativeEvent.contentOffset.y === 0
}
export const setupChildListener = function () {
    firebase.database().ref('Messages').child(this.state.projectId).child(this.state.IssueId)
        .orderByChild('sentTime')
        .startAt(this.state.messagesData.length === 0 ? Date.now() : this.state.messagesData[this.state.messagesData.length - 1].sentTime)
        .on('child_added', data => {
            const mostRecentmessage = this.state.messagesData[this.state.messagesData.length - 1]
            const currentMessage = data._value
            if (!mostRecentmessage) {
                this.setState({ messagesData: [...this.state.messagesData, currentMessage] })
            }
            else if (currentMessage && mostRecentmessage) {
                if (currentMessage.sentTime === mostRecentmessage.sentTime && currentMessage.messageBody === mostRecentmessage.messageBody && currentMessage.sender === mostRecentmessage.sender) {
                    return
                } else {
                    if (this.state.currentPosition !== "Bottom") {
                        if (currentMessage.sender !== firebase.auth().currentUser.uid) {
                            Toast.show({ text: 'New Messages Arrived', buttonText: 'Ok' })
                        }
                    }
                    this.setState({ messagesData: [...this.state.messagesData, data._value] })
                }
            }
        });
}
export const formatDate = function (date) {
    var monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var time = 'AM';
    if (hours > 12) {
        hours = hours - 12;
        time = 'PM';
    }
    if (minutes < 10) {
        minutes = '0' + JSON.stringify(minutes);
    }
    return hours + ':' + minutes + ' ' + time;
}
export const fetchThumbnail = function (id) {
    if (this.props.project) {
        const projThumb = this.props.project.projectmanager ? this.props.project.projectmanager[id]
            ? this.props.project.projectmanager[id].profilepic : null : null;
        const leadThumb = this.props.project.teamleads ? this.props.project.teamleads[id]
            ? this.props.project.teamleads[id].profilepic : null : null;
        const memberThumb = this.props.project.teammembers ? this.props.project.teammembers[id]
            ? this.props.project.teammembers[id].profilepic : null : null;
        if (projThumb) {
            return projThumb;
        } else if (leadThumb) {
            return leadThumb;
        } else {
            return memberThumb;
        }
    } else {
        return null;
    }
}
export const markClosed = function () {
    if (this.props.issue.issueStatus === 'Opened') {
        firebase.database().ref('Issues').child(this.state.IssueId).child('issueStatus').set('Closed');
    } else {
        firebase.database().ref('Issues').child(this.state.IssueId).child('issueStatus').set('Opened');
    }
}
export const changePriority = function () {
    firebase.database().ref('Issues').child(this.state.IssueId).child('issuePriority').once('value', data => {
        if (data._value === 'Critical') {
            firebase.database().ref('Issues').child(this.state.IssueId).child('issuePriority').set('Normal');
        } else {
            firebase.database().ref('Issues').child(this.state.IssueId).child('issuePriority').set('Critical');
        }
    });
}
export const handleSendMessage = function () {
    if (this.state.messageBody) {
        const message = {
            messageBody: this.state.messageBody,
            sender: firebase.auth().currentUser.uid,
            sentTime: Date.now(),
        };
        this.setState({ messageBody: null });
        firebase.database().ref('Messages').child(this.state.projectId).child(this.state.IssueId).push(message, err => {
            if (!err) {
                this.handleNotifications(message.messageBody)
            }
            console.log(err);
        })
    } else {
        Toast.show({ text: 'Please Enter A Message First', buttonText: 'Ok' });
    }
}

export const preFetchFunc = function () {
    const isProjectManager = this.props.project.projectmanager ? this.props.project.projectmanager[firebase.auth().currentUser.uid] : false
    const isTeamLead = this.props.project.teamleads ? this.props.project.teamleads[firebase.auth().currentUser.uid] : false
    if (isProjectManager) {
        this.setState({ Status: 'ProjectManager', UserName: this.props.project.projectmanager[firebase.auth().currentUser.uid].fullName })
    } else if (isTeamLead) {
        this.setState({ Status: 'TeamLead', UserName: this.props.project.teamleads[firebase.auth().currentUser.uid].fullName })
    } else {
        this.setState({ Status: 'Member', UserName: this.props.project.teammembers[firebase.auth().currentUser.uid].fullName })
    }
    firebase.database().ref('Messages').child(this.state.projectId).child(this.state.IssueId).orderByChild('sentTime')
        .endAt(Date.now())
        .limitToLast(20)
        .once('value', data => {
            const Arr = Object.keys(data._value ? data._value : []).map(k => {
                return data._value[k];
            });
            const sortArr = Arr.sort((a, b) => {
                if (a.sentTime < b.sentTime) return -1
                else if (a.sentTime > b.sentTime) return 1
                else return 0
            })
            this.setState({ messagesData: [...this.state.messagesData, ...sortArr] })
            this.setupChildListener()
        });
}