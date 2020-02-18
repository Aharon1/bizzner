import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  StyleSheet
} from "react-native";
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import AsyncStorage from '@react-native-community/async-storage';
import MainStyles from "./StyleSheet";
import Toast from "react-native-simple-toast";
import { SERVER_URL } from "../Constants";
import LinkedInModal from "react-native-linkedin";
import HardText from '../HardText';
import { loadingChange, actionUserSignIn } from '../Actions';
import { connect } from 'react-redux';
import Axios from "axios";
import firebase from 'react-native-firebase';
//import PushNotification from 'react-native-push-notification';
const clientID = "81fcixszrwwavz";
const redirectUri = "http://bizzner.com/app/linkedin-auth.php";
const secret = "m3sWUS3DpPoHZdZk";
class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      access_token: "",
      authentication_code: ''
    };
    this.Login = this._Login.bind(this);
    this.getLinkedinAccessToken = this._getLinkedinAccessToken.bind(this);
  }
  static navigationOptions = {
    header: null
  };
  async saveDetails(key, value) {
    await AsyncStorage.setItem(key, value);
  }
  async _Login() {

    const access_token = this.state.access_token;
    if (!access_token) {
      Toast.show("Linkedin is temporarily disabled", Toast.SHORT);
      this.props.loadingChangeAction(false);
      return false;
    }
    const baseApi = "https://api.linkedin.com/v2/me/";
    Axios.all([
      Axios.get(`${baseApi}?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + access_token
        }
      }),
      Axios.get(`https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + access_token
        }
      })
    ])
      .then(Axios.spread((ProfileRes, emailRes) => {
        let profile = ProfileRes.data;
        let profilePictureElements = profile.profilePicture['displayImage~'].elements;
        let identifieresPicture = profilePictureElements[profilePictureElements.length - 1].identifiers[0].identifier;
        let emailElements = emailRes.data.elements;
        let emailAddress = '';
        for (let i = 0; i < emailElements.length; i++) {
          if (emailElements[i].type == 'EMAIL') {
            emailAddress = emailElements[i]['handle~'].emailAddress;
            break;
          }
        }
        let params = "firstName=" + encodeURIComponent(profile.localizedFirstName) + "&";
        params += "lastName=" + encodeURIComponent(profile.localizedLastName) + "&";
        params += "emailAddress=" + encodeURIComponent(emailAddress) + "&";
        params += "headline=&";
        params += "location=&";
        params += "position=&";
        params += "profilePicture=" + encodeURIComponent(identifieresPicture);
        this.setState({ parameters: params }, this.getToken);
      }))
      .catch(error => {
        setTimeout(() => { Toast.show(error.message, Toast.SHORT); }, 200);
        this.props.loadingChangeAction(false);
      });
  }
  componentDidMount() {
    // B
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.checkToken(url);
      });
    } else {
      Linking.addListener("url", this.handleOpenURL);
    }
    check(Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }))
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            this.requestLocationPermission();
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            this.setState({ isGPSGranted: true });
            break;
          case RESULTS.BLOCKED:
            this.requestLocationPermission();
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log('Toast',error);
        // …
      });
  }
  requestLocationPermission() {
    request(Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    })).then(result => {
        if (result == 'granted') {
            this.setState({ isGPSGranted: true });
        }
        else {
            this.setState({ isGPSGranted: false });
        }
    });
  }
  componentWillUnmount() {
    // C
    Linking.removeEventListener("url", this.handleOpenURL);
  }
  handleOpenURL = event => {
    // D
    this.checkToken(event.url);
  };
  checkToken = url => {
    if (url) {
      var fullUrl = url.split("/");
      var tokenString = fullUrl[fullUrl.length - 2];
      if (tokenString == "token") {
        var token = fullUrl[fullUrl.length - 1];
        fetch(SERVER_URL + "?action=check-token&token=" + token)
          .then(res => res.json())
          .then(async response => {
            if (response.code == 200) {
              this.props.LoginUserAction(response.body.ID, '');
              setTimeout(() => { Toast.show(message, Toast.SHORT); }, 200);
              await AsyncStorage.multiSet([['isUserLoggedIn', "true"], ["userData", body.ID], ["userToken", '']]).then(() => {
                this.props.navigation.navigate("ConfirmScreen");
                this.props.loadingChangeAction(false);
              });
            } else {
              Toast.show(response.message, Toast.SHORT);
            }
          })
          .catch(err => {
            setTimeout(() => { Toast.show(err.message, Toast.SHORT); }, 200);
          });
      }
    }
  };
  renderButton = () => {
    return (
      <TouchableOpacity>
        <Image
          source={require("../assets/l-btn.png")}
          style={[{ width: "100%" }]}
          resizeMode={"contain"}
        />
      </TouchableOpacity>
    );
  };
  async getToken() {
    await firebase.messaging().getToken().then(async fcmToken => {
      if (fcmToken) {
        this.sendDataToServer(fcmToken);
      }
      else {
        this.sendDataToServer('');
      }
    }).catch(err => {
      this.props.loadingChangeAction(false);
    });
  }
  sendDataToServer(token) {
    Axios.get(`${SERVER_URL}?action=check_user_details&${this.state.parameters}&device_token=${token}&platform=${Platform.OS}`)
      .then(async res => {
        console.log(res.data);
        let { code, message, body } = res.data;
        if (code == 200) {
          this.props.LoginUserAction(body.ID, token);
          setTimeout(() => { Toast.show(message, Toast.SHORT); }, 200);
          await AsyncStorage.multiSet([['isUserLoggedIn', "true"], ["userData", body.ID], ["userToken", token]]).then(() => {
            this.props.navigation.navigate("Profile");
            this.props.loadingChangeAction(false);
          });
        }
      })
      .catch(err => {
        setTimeout(() => { Toast.show(err.message, Toast.SHORT); }, 200);
        this.props.loadingChangeAction(false);
      });
  }
  async _getLinkedinAccessToken() {
    let linkedinAccessTokenHeaders = new Headers();
    linkedinAccessTokenHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var requestOptions = {
      method: 'POST',
      headers: linkedinAccessTokenHeaders,
      redirect: 'follow'
    };
    fetch(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${this.state.authentication_code}&redirect_uri=${redirectUri}&client_id=${clientID}&client_secret=${secret}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.setState({ access_token: result.access_token }, this.Login);
      })
      .catch(error => {
        setTimeout(() => { Toast.show(error.message, Toast.LONG) }, 500);
        this.props.loadingChangeAction(false);
      });
  }
  linkedRef = React.createRef(LinkedInModal)
  render() {

    return (
      <View style={MainStyles.container}>
        <View style={[MainStyles.minContainer, { width: 250 }]}>
          <Image
            source={require("../assets/bizzner-logo.png")}
            style={{ width: 213, height: 55 }}
          />
          <Text style={MainStyles.mPHeading}>{HardText.auth_heading}</Text>
        </View>
        <View style={[MainStyles.btn, MainStyles.linBtn]}>
          <LinkedInModal
            ref={this.linkedRef}
            clientID={clientID}
            clientSecret={null}
            shouldGetAccessToken={false}
            redirectUri={redirectUri}
            permissions={['r_liteprofile', 'r_emailaddress']}
            onSuccess={({ authentication_code }) => {
              this.props.loadingChangeAction(true);
              this.setState({ authentication_code }, this.getLinkedinAccessToken);
            }}
            linkText="Sign in with Linkedin"
            wrapperStyle={{ padding: 15, backgroundColor: '#0077b5' }}
            areaTouchText={{ top: 20, bottom: 20, left: 150, right: 150 }}
            onError={(err) => {
              setTimeout(() => { Toast.show(err.message, Toast.SHORT); }, 200);
              this.props.loadingChangeAction(false);
            }}
            renderButton={(props) => (
              <TouchableOpacity onPress={() => { this.linkedRef.current.open() }}>
                <Image

                  source={require("../assets/l-btn.png")}
                  style={{ width: "100%" }}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <TouchableOpacity
          style={[MainStyles.btn]}
          onPress={() => {
            this.props.navigation.navigate("SignIn");
          }}
        >
          <Image
            source={require("../assets/e-btn.png")}
            style={{ width: "100%" }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
        <View style={MainStyles.minContainer}>
          <Image
            source={require("../assets/or.png")}
            style={[MainStyles.orImg, { width: "100%" }]}
            resizeMode={"contain"}
          />
        </View>
        <TouchableOpacity
          style={[MainStyles.btn]}
          onPress={() => {
            this.props.navigation.navigate("SignUp");
          }}
        >
          <Image
            source={require("../assets/su-btn.png")}
            style={{ width: "100%" }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
        <Text style={MainStyles.mPHeading}
          onPress={() => Linking.openURL(`${SERVER_URL}/termsfeed-terms-conditions-pdf-english.pdf`)}>
          {"Terms and conditions"}
        </Text>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  const { reducer } = state
  return { reducer }
};
const mapDispatchToProps = dispatch => ({
  loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet)),
  LoginUserAction: (userData) => dispatch(actionUserSignIn(userData)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});
