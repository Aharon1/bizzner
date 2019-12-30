import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Linking,
  StyleSheet
} from "react-native";
import MainStyles from "./StyleSheet";
import Loader from "./Loader";
import Toast from "react-native-simple-toast";
import { SERVER_URL } from "../Constants";
import LinkedInModal from "react-native-linkedin";
import HardText from '../HardText';
import { loadingChange, actionUserSignIn } from '../Actions';
import { connect } from 'react-redux';
import Axios from "axios";
import firebase from 'react-native-firebase';
//import PushNotification from 'react-native-push-notification';
class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      access_token: ""
    };
  }
  static navigationOptions = {
    header: null
  };
  async saveDetails(key, value) {
    await AsyncStorage.setItem(key, value);
  }
  async Login() {
    this.props.loadingChangeAction(true);
    const access_token = this.state.access_token;
    if (!access_token) {
      Toast.show("Linkedin is temporarily disabled", Toast.SHORT);
      this.props.loadingChangeAction(false);
      return false;
    }
    const baseApi = "https://api.linkedin.com/v2/me/";
    const options = [
      // "first-name",
      // "last-name",
      // "email-address",
      // "headline",
      // "summary",
      // "location:(name)",
      // "picture-urls::(original)",
      // "positions"
      //'r_liteprofile', 'r_emailaddress','r_basicprofile','r_fullprofile'
      'id','firstName','lastName','profilePicture(displayImage~:playableStreams)'
    ];
    console.log(`${baseApi}~:(${options.join(",")})?format=json`);
    Axios.get(`${baseApi}?projection=(${options.join(",")})`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + access_token
      }
    }).then(res => {
      console.log(res.data);
      Axios.get(`https://api.linkedin.com/v2/people/(id:${res.data.id})`)
      .then(res=>{
        console.log(res.data);
      }).catch(err=>{
        console.log('Profile Error',err.message);
      this.props.loadingChangeAction(false);
      })
      const {
        emailAddress,
        firstName,
        headline,
        lastName,
        location: { name },
        pictureUrls,
        positions
      } = res.data;
      let params = "firstName=" + encodeURIComponent(firstName) + "&";
      params += "lastName=" + encodeURIComponent(lastName) + "&";
      params += "emailAddress=" + encodeURIComponent(emailAddress) + "&";
      params += "headline=" + encodeURIComponent(headline) + "&";
      params += "location=" + encodeURIComponent(name) + "&";
      params += "position=" + encodeURIComponent(positions.values[0].title) + "&";
      params += "profilePicture=" + encodeURIComponent(pictureUrls.values[0]);
      this.setState({ parameters: params }, this.getToken);
    }).catch(err => {
      console.log(err.message);
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
          .then(response => {
            if (response.code == 200) {
              this.saveDetails("isUserLoggedin", "true");
              this.saveDetails("userID", response.body.ID);
              Toast.show(response.message, Toast.SHORT);
              this.props.navigation.navigate("ConfirmScreen");
            } else {
              Toast.show(response.message, Toast.SHORT);
            }
          })
          .catch(err => {
            console.log(err);
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
      .then(res => {
        let { code, message, body } = res.data;
        if (code == 200) {
          this.saveDetails("isUserLoggedin", "true");
          this.saveDetails("userID", body.ID);
          Toast.show(message, Toast.SHORT);
          setTimeout(() => {
            this.props.loadingChangeAction(false);
            this.props.navigation.navigate("Profile");
          }, 200);
        }
      })
      .catch(err => {
        console.error(err);
        this.props.loadingChangeAction(false);
      });
  }
  linkedRef = React.createRef(LinkedInModal)
  render() {
    // const clientID = "81fcixszrwwavz";
    // const redirectUri = "http://bizzner.com/app/linkedin-auth.php";
    // const secret = "m3sWUS3DpPoHZdZk";
    return (
      <View style={MainStyles.container}>
        <Loader loading={this.state.loading} />
        <View style={[MainStyles.minContainer, { width: 250 }]}>
          <Image
            source={require("../assets/bizzner-logo.png")}
            style={{ width: 213, height: 55 }}
          />
          <Text style={MainStyles.mPHeading}>{HardText.auth_heading}</Text>
        </View>
        <View style={[MainStyles.btn, MainStyles.linBtn]}>
          {/* <LinkedInModal
            ref={this.linkedRef}
            clientID={clientID}
            clientSecret={secret}
            shouldGetAccessToken={true}
            redirectUri={redirectUri}
            permissions={['r_liteprofile', 'r_emailaddress']}
            onSuccess={({ access_token, expires_in }) => {
              console.log(access_token,expires_in);
              this.setState({ access_token }, this.Login);
            }}
            linkText="Sign in with Linkedin"
            wrapperStyle={{ padding: 15, backgroundColor: '#0077b5' }}
            areaTouchText={{ top: 20, bottom: 20, left: 150, right: 150 }}
            onError={(err) => {
              console.log(err);
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
          /> */}
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
