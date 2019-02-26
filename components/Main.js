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

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      token: ""
    };
  }
  static navigationOptions = {
    header: null
  };
  async saveDetails(key, value) {
    await AsyncStorage.setItem(key, value);
  }
  async Login() {
    this.setState({
      loading: true
    });
    const access_token = this.state.token.access_token;
    if (!access_token) {
      Toast.show("Linkedin is temporarily disabled", Toast.SHORT);
      this.setState({
        loading: false
      });
      return false;
    }
    const baseApi = "https://api.linkedin.com/v1/people/";
    const options = [
      "first-name",
      "last-name",
      "email-address",
      "headline",
      "summary",
      "location:(name)",
      "picture-urls::(original)",
      "positions"
    ];

    const profile = await fetch(
      `${baseApi}~:(${options.join(",")})?format=json`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token
        }
      }
    );
    const payload = await profile.json();
    const {
      emailAddress,
      firstName,
      headline,
      lastName,
      location: { name },
      pictureUrls,
      positions
    } = payload;

    var params = "firstName=" + encodeURIComponent(firstName) + "&";
    params += "lastName=" + encodeURIComponent(lastName) + "&";
    params += "emailAddress=" + encodeURIComponent(emailAddress) + "&";
    params += "headline=" + encodeURIComponent(headline) + "&";
    params += "location=" + encodeURIComponent(name) + "&";
    params += "position=" + encodeURIComponent(positions.values[0].title) + "&";
    params += "profilePicture=" + encodeURIComponent(pictureUrls.values[0]);
    fetch(SERVER_URL + "?action=check_user_details&" + params)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.code == 200) {
          this.setState({
            loading: false
          });
          this.saveDetails("isUserLoggedin", "true");
          this.saveDetails("userID", res.body.ID);
          Toast.show(res.message, Toast.SHORT);
          setTimeout(() => {
            this.setState({ loading: false });
            this.props.navigation.navigate("Profile");
          }, 200);
        }
      })
      .catch(err => {
        console.error(err);
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
      <Image
        source={require("../assets/l-btn.png")}
        style={[{ width: "100%" }]}
        resizeMode={"contain"}
      />
    );
  };
  render() {
    const clientID = "81fcixszrwwavz";
    const redirectUri = "http://bizzner.com/app/linkedin-auth.php";
    const secret = "m3sWUS3DpPoHZdZk";

    return (
      <View style={MainStyles.container}>
        <Loader loading={this.state.loading} />
        <View style={[MainStyles.minContainer, { width: 250 }]}>
          <Image
            source={require("../assets/bizzner-logo.png")}
            style={{ width: 213, height: 55 }}
          />
          <Text style={MainStyles.mPHeading}>
            {" "}
            Your daily dose of inspiring people to meet{" "}
          </Text>
        </View>
        <View style={[MainStyles.btn, MainStyles.linBtn]}>
          <LinkedInModal
            clientID={clientID}
            clientSecret={secret}
            redirectUri={redirectUri}
            onSuccess={token => {
              this.setState(
                {
                  token
                },
                this.Login
              );
            }}
            renderButton={this.renderButton}
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
      </View>
    );
  }
}
export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});
