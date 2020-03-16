import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
// import Toast from '../../native-base-theme/components/Toast';
import { Toast } from 'native-base'
const options = {
    title: 'Select Image',
    storageOptions: { skipBackup: true, path: 'images' }
};
export const handleUpdate = async function () {
    try {
        const updateEmail = this.props.user.email !== this.state.userEmail
        const updateFullName = this.props.user.fullName !== this.state.fullName
        const updateProfilePic = this.props.user.profilepic !== this.state.imgSource.uri
        let user = firebase.auth().currentUser
        this.setState({ showActivity: true })
        if (this.state.userPassword === this.state.userPasswordConfirm) {
            let credential = firebase.auth.EmailAuthProvider.credential(this.props.user.email, this.state.userPassword)
            await user.reauthenticateWithCredential(credential)
            this.setState({ showActivity: false })
        } else {
            Toast.show({ text: "Passwords Do not Match", buttonText: "Okay", duration: 1500 })
            this.setState({ showActivity: false })
        }
    } catch (err) {
        Toast.show({ text: err.message, buttonText: "Ok", duration: 1500 })
        this.setState({ showActivity: false })
    }

}

export const handlePickImage = function () {
    ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
            // alert('You cancelled image picker 😟');
        } else if (response.error) {
            alert('And error occured: ', response.error);
        } else {
            const source = { uri: response.uri };
            ImageResizer.createResizedImage(source.uri, 200, 200, 'PNG', 99).then((output) => {
                console.log(output.uri)
                this.setState({ imgSource: { uri: output.uri }, imagePicked: true })
                console.log(this.state)
            }).catch((err) => {
                console.log(err.message)
            });
        }
    });
}