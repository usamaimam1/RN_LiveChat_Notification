import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
const options = {
    title: 'Select Image',
    storageOptions: { skipBackup: true, path: 'images' }
};
export const handleUpdate = function () {
    if (this.state.imagePicked) {
        firebase.storage()
            .ref(`profilepics/${this.props.user.uid}`)
            .putFile(this.state.profilepic)
            .then(storageTask => {
                const imageRef = firebase.database().ref('users').child(this.props.user.uid).child('profilepic')
                imageRef.set(storageTask.downloadURL, () => {
                    this.setState({ imagePicked: false })
                    alert('Image Updated Successfully')
                })
            })
    } else {
        alert('Nothing to update')
    }

}

export const handlePickImage = function () {
    ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
            alert('You cancelled image picker 😟');
        } else if (response.error) {
            alert('And error occured: ', response.error);
        } else {
            const source = { uri: response.uri };
            ImageResizer.createResizedImage(source.uri, 200, 200, 'PNG', 99).then((output) => {
                this.setState({ profilepic: output.uri, imagePicked: true })
            }).catch((err) => {
                console.log(err.message)
            });
        }
    });
}