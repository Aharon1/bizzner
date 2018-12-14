import { PermissionsAndroid } from 'react-native';
const RequestPermssions = {
    Camera: async ()=>{
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                'title': 'Bizzer wants to access your camera',
                'message': 'Bizzner App needs access to your camera '
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Response',"You can use the camera")
                return true;
            } else {
                console.log('Response',"Camera permission denied")
                return false;
            }
        } catch (err) {
            console.warn('Response',err)
        }
    },
    RES:async ()=>{
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                'title': 'Bizzer wants to access your media',
                'message': 'Bizzner App needs access to your media '
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera")
                return true;
            } else {
                console.log("Camera permission denied")
                return false;
            }
        } catch (err) {
            console.warn('Response',err)
        }
    }
}
export default RequestPermssions;