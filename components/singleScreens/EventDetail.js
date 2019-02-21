import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  TouchableHighlight
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MainStyles from "../StyleSheet";
import { SERVER_URL } from "../../Constants";
import Loader from "../Loader";
import ProgressiveImage from "../../components/AsyncModules/ImageComponent";
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import Toast from "react-native-simple-toast";
import { MapForEventDetail } from "./MapForDetails";
export default class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      event_id: this.props.navigation.getParam("event_id"),
      userList: {},
      curStatus: "",
      eventData: "",
      isRefreshing: false,
      profileDetailShow: false,
      profilePicture: "",
      isLoadingProfile: true,
      userData: [],
      isMapShow: false
    };
    this.fetchNewDetails = this._fetchNewDetails.bind(this);
    this.fetchUserData = this._fetchUserData.bind(this);
    //this.getEventUsers();
  }
  async setUserId() {
    var userID = await AsyncStorage.getItem("userID");
    this.setState({ userID });
  }
  componentDidMount() {
    this.setUserId();
    setTimeout(() => {
      this.fetchNewDetails();
    }, 200);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    var paramEventId = this.props.navigation.getParam("event_id");
    var prevEventId = prevProps.navigation.getParam("event_id");
    if (paramEventId != prevState.event_id) {
      this.setState({
        loading: true,
        userList: {},
        eventData: "",
        curStatus: "",
        event_id: paramEventId
      });
      this.fetchNewDetails();
    }
  }
  _fetchNewDetails() {
    var user_id = this.state.userID;
    var eventId = this.state.event_id;
    fetch(
      SERVER_URL +
        "?action=getEventUsers&event_id=" +
        eventId +
        "&user_id=" +
        user_id
    )
      .then(response => response.json())
      .then(res => {
        this.setState({
          loading: false,
          isRefreshing: false,
          userList: res.users,
          eventData: res.event_data,
          curStatus: res.curStatus
        });
      });
  }
  formatAMPM(date) {
    var date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  formatDate(date) {
    var date = new Date(date);
    var dateStr = "";
    dateStr +=
      date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
    var monthArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var month = monthArray[date.getMonth()];
    dateStr += month + " ";
    dateStr += date.getFullYear();
    return dateStr;
  }
  setUserEventStatus = async statusValue => {
    var curItem = this.state.eventData;
    var user_id = this.state.userID;
    fetch(
      SERVER_URL +
        "?action=changeUserEventStatus&user_id=" +
        user_id +
        "&event_id=" +
        curItem.group_id +
        "&status=" +
        statusValue
    ).then(response => {
      this.fetchNewDetails();
      curStatus = statusValue;
      this.setState({ curStatus: statusValue });
      if (statusValue == 1) {
        Toast.show("You are interested to this event", Toast.SHORT);
      } else if (statusValue == 2) {
        Toast.show("You are joined to this event", Toast.SHORT);
      } else if (statusValue == 3) {
        Toast.show("You have ignored this event", Toast.SHORT);
      }
    });
  };
  _fetchUserData = user_id => {
    this.setState({ isLoadingProfile: true, profileDetailShow: true });
    fetch(SERVER_URL + "?action=get_user_data&user_id=" + user_id)
      .then(res => res.json())
      .then(response => {
        this.setState({ userData: response.body, isLoadingProfile: false });
      })
      .catch(err => {
        console.log(err);
      });
  };
  startPrivateChat(other_user_id) {
    this.setState({ loading: true });
    fetch(
      SERVER_URL +
        "?action=startPrivateChat&user_id=" +
        this.state.userID +
        "&privateUserId=" +
        other_user_id
    )
      .then(res => res.json())
      .then(response => {
        this.setState({ loading: false });
        this.props.navigation.navigate("Private Chat", {
          event_id: response.privateChatId
        });
      })
      .catch(err => {});
  }
  showMap = () => {
    this.setState({
      isMapShow: !this.state.isMapShow
    });
  };
  render() {
    const { location } = this.props.navigation.state.params;
    return (
      <SafeAreaView style={MainStyles.normalContainer}>
        <Loader loading={this.state.loading} />
        <View style={[MainStyles.eventsHeader, { justifyContent: "center" }]}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              paddingLeft: 12,
              flexDirection: "row"
            }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon
              name="chevron-left"
              style={{ fontSize: 24, color: "#8da6d5" }}
            />
            <Text style={{ fontSize: 16, color: "#8da6d5", marginLeft: 20 }}>
              EVENT DETAILS
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            MainStyles.tabContainer,
            {
              elevation: 0,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "column"
            }
          ]}
        >
          <View
            style={{
              justifyContent: "space-around",
              width: "100%",
              marginBottom: 10,
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={[MainStyles.tabItem, MainStyles.tabItemActive]}
              onPress={() =>
                this.props.navigation.navigate("EventDetail", {
                  event_id: this.state.event_id
                })
              }
            >
              <Icon
                name="user-plus"
                style={[
                  MainStyles.tabItemIcon,
                  MainStyles.tabItemActiveIcon,
                  { fontSize: 14 }
                ]}
              />
              <Text
                style={[
                  MainStyles.tabItemIcon,
                  MainStyles.tabItemActiveText,
                  { fontSize: 14 }
                ]}
              >
                Invited to event
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                MainStyles.tabItem,
                this.state.TabComponent == "map"
                  ? MainStyles.tabItemActive
                  : null
              ]}
            >
              <Icon
                name="share-alt"
                style={[MainStyles.tabItemIcon, { fontSize: 14 }]}
              />
              <Text style={[MainStyles.tabItemIcon, { fontSize: 14 }]}>
                Share
              </Text>
            </TouchableOpacity>
            {this.state.curStatus != "" && (
              <TouchableOpacity
                style={MainStyles.tabItem}
                onPress={() =>
                  this.props.navigation.navigate("Event Chat", {
                    event_id: this.state.event_id,
                    note: this.state.eventData.event_note
                  })
                }
              >
                <Icon
                  name="comments"
                  style={[MainStyles.tabItemIcon, { fontSize: 14 }]}
                />
                <Text style={[MainStyles.tabItemIcon, { fontSize: 14 }]}>
                  Event chat
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {this.state.isMapShow ? (
            <MapForEventDetail
              style={{ marginBottom: 20 }}
              location={location}
            />
          ) : null}
        </View>

        {(this.state.curStatus != 1 ||
          this.state.curStatus != 2 ||
          this.state.curStatus != 3) &&
          this.state.eventData.usersCount < this.state.eventData.usersPlace && (
            <View
              style={[
                MainStyles.EventScreenTabWrapper,
                { backgroundColor: "#d1dbed" }
              ]}
            >
              <TouchableOpacity
                style={[
                  MainStyles.EIAButtons,
                  this.state.curStatus == 2
                    ? { backgroundColor: "#87d292" }
                    : ""
                ]}
                onPress={() => this.setUserEventStatus(2)}
              >
                <Icon
                  name="check"
                  size={15}
                  style={{ color: "#FFF", marginRight: 5 }}
                />
                <Text
                  style={{
                    color: "#FFF",
                    fontFamily: "Roboto-Medium",
                    fontSize: 14
                  }}
                >
                  Join
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.EIAButtons,
                  { marginHorizontal: 5 },
                  this.state.curStatus == 1
                    ? { backgroundColor: "#8da6d5" }
                    : ""
                ]}
                onPress={() => this.setUserEventStatus(1)}
              >
                <Icon
                  name="star"
                  size={15}
                  style={{ color: "#FFF", marginRight: 5 }}
                />
                <Text
                  style={{
                    color: "#FFF",
                    fontFamily: "Roboto-Medium",
                    fontSize: 14
                  }}
                >
                  Interested
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  MainStyles.EIAButtons,
                  this.state.curStatus == 3
                    ? { backgroundColor: "#d28787" }
                    : ""
                ]}
                onPress={() => this.setUserEventStatus(3)}
              >
                <Icon
                  name="ban"
                  size={15}
                  style={{ color: "#FFF", marginRight: 5 }}
                />
                <Text
                  style={{
                    color: "#FFF",
                    fontFamily: "Roboto-Medium",
                    fontSize: 14
                  }}
                >
                  Ignore
                </Text>
              </TouchableOpacity>
            </View>
          )}
        {this.state.eventData.usersCount == 0 &&
          this.state.curStatus != 1 &&
          this.state.curStatus != 2 &&
          this.state.curStatus != 3 &&
          this.state.eventData.usersCount ==
            this.state.eventData.usersPlace && (
            <View
              style={[
                {
                  paddingVertical: 5,
                  backgroundColor: "#8da6d4",
                  justifyContent: "center",
                  alignItems: "center"
                }
              ]}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "Roboto-Medium",
                  fontSize: 15
                }}
              >
                No more places available
              </Text>
            </View>
          )}
        {this.state && this.state.eventData != "" && (
          <TouchableHighlight onPress={this.showMap}>
            <View style={MainStyles.eventDataHeader}>
              <View style={{ width: 40, height: 40, marginRight: 10 }}>
                <ProgressiveImage
                  source={{ uri: this.state.eventData.photoUrl }}
                  style={{ width: 40, height: 40 }}
                />
              </View>
              <View
                style={{
                  justifyContent: "flex-start",
                  paddingRight: 10,
                  flexDirection: "column"
                }}
              >
                <Text
                  style={{
                    color: "#03163a",
                    fontFamily: "Roboto-Regular",
                    fontSize: 12,
                    flexWrap: "wrap"
                  }}
                >
                  {this.state.eventData.group_name},
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Light",
                    fontSize: 11,
                    flexWrap: "wrap"
                  }}
                >
                  {" "}
                  {this.state.eventData.group_address}
                </Text>
                <Text
                  style={{
                    color: "#39b54a",
                    fontFamily: "Roboto-Medium",
                    fontSize: 11,
                    flexWrap: "wrap"
                  }}
                >
                  {this.state.eventData.event_subject}
                </Text>
                <Text
                  style={{
                    color: "#03163a",
                    fontFamily: "Roboto-Light",
                    fontSize: 11,
                    flexWrap: "wrap"
                  }}
                >
                  Note: {this.state.eventData.event_note}
                </Text>
                <Text
                  style={{
                    color: "#03163a",
                    fontFamily: "Roboto-Light",
                    fontSize: 11,
                    flexWrap: "wrap"
                  }}
                >
                  {this.formatDate(
                    this.state.eventData.event_date +
                      " " +
                      this.state.eventData.event_time
                  )}{" "}
                  {this.formatAMPM(
                    this.state.eventData.event_date +
                      " " +
                      this.state.eventData.event_time
                  )}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        )}

        {this.state && this.state.userList && this.state.userList.length > 0 && (
          <FlatList
            data={this.state.userList}
            renderItem={({ item }) => (
              <View
                style={[
                  MainStyles.UserListItem,
                  item.status == "1" ? { backgroundColor: "#d1dbed" } : ""
                ]}
              >
                <TouchableOpacity
                  style={MainStyles.userListItemImageWrapper}
                  onPress={() => this.fetchUserData(item.user_id)}
                >
                  <ProgressiveImage
                    source={{ uri: item.picUrl }}
                    style={MainStyles.userListItemIWImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View style={MainStyles.userListItemTextWrapper}>
                  <Text style={MainStyles.ULITWName}>{item.name}</Text>
                  <Text style={MainStyles.ULITWTitle}>{item.title}</Text>
                  {this.state.eventData.created_by == item.user_id && (
                    <View
                      style={[
                        MainStyles.ULITWAction,
                        { backgroundColor: "#8da6d5" }
                      ]}
                    >
                      <Icon name="user" style={MainStyles.ULITWActionIcon} />
                      <Text style={MainStyles.ULITWActionText}>OWNER</Text>
                    </View>
                  )}
                  {item.status == "1" && (
                    <View
                      style={[
                        MainStyles.ULITWAction,
                        { backgroundColor: "#8da6d5" }
                      ]}
                    >
                      <Icon name="star" style={MainStyles.ULITWActionIcon} />
                      <Text style={MainStyles.ULITWActionText}>INTRESTED</Text>
                    </View>
                  )}
                  {item.status == "2" && (
                    <View style={MainStyles.ULITWAction}>
                      <Icon name="check" style={MainStyles.ULITWActionIcon} />
                      <Text style={MainStyles.ULITWActionText}>ACCEPTED</Text>
                    </View>
                  )}
                </View>
                {item.user_id != this.state.userID && (
                  <TouchableOpacity
                    style={MainStyles.ChatIconWrapper}
                    onPress={() => {
                      this.startPrivateChat(item.user_id);
                    }}
                  >
                    <Icon name="comments" style={MainStyles.ChatIcon} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => {
                  this.setState({ isRefreshing: true });
                  this.fetchNewDetails();
                }}
                title="Pull to refresh"
                tintColor="#fff"
                titleColor="#fff"
                colors={["#2e4d85", "red", "green", "blue"]}
              />
            }
            keyExtractor={item => item.key}
          />
        )}
        <Dialog
          visible={this.state.profileDetailShow}
          dialogStyle={[
            MainStyles.confirmPopup,
            { width: "95%", padding: 0, maxHeight: "95%" }
          ]}
          dialogAnimation={new SlideAnimation()}
          containerStyle={{
            zIndex: 10,
            flex: 1,
            justifyContent: "space-between"
          }}
          rounded={false}
        >
          <View
            style={[
              MainStyles.confirmPopupHeader,
              {
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
                backgroundColor: "#416bb9"
              }
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  profileDetailShow: false,
                  isLoadingProfile: true,
                  userData: ""
                })
              }
            >
              <Icon name="times" style={{ fontSize: 20, color: "#FFF" }} />
            </TouchableOpacity>
            <Text
              style={{
                color: "#FFF",
                fontFamily: "Roboto-Medium",
                fontSize: 17,
                marginLeft: 20
              }}
            >
              PROFILE DETAILS
            </Text>
          </View>
          <View
            style={{
              padding: 0,
              borderWidth: 0,
              backgroundColor: "#FFF",
              overflow: "visible"
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 0
              }}
            >
              {this.state.isLoadingProfile && (
                <ActivityIndicator
                  size="large"
                  color="#0947b9"
                  animating={true}
                />
              )}
              {!this.state.isLoadingProfile && this.state.userData && (
                <View>
                  <View
                    style={{
                      backgroundColor: "#2e4d85",
                      height: 100,
                      paddingTop: 20,
                      overflow: "visible",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        width: 120,
                        height: 120,
                        borderWidth: 5,
                        borderColor: "#FFF",
                        borderRadius: 100,
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      <ProgressiveImage
                        source={{ uri: this.state.userData.user_pic_thumb }}
                        style={{ width: 120, height: 120 }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: 50,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Roboto-Light",
                        fontSize: 20,
                        color: "#0947b9"
                      }}
                    >
                      {this.state.userData.first_name}{" "}
                      {this.state.userData.last_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 40,
                      flex: 1
                    }}
                  >
                    <View style={MainStyles.profileTextItem}>
                      <Icon
                        name="map-marker"
                        size={16}
                        style={MainStyles.profileTextItemIcon}
                      />
                      <Text style={MainStyles.PTIText}>
                        {this.state.userData.country}{" "}
                      </Text>
                    </View>
                    <View style={MainStyles.profileTextItem}>
                      <Icon
                        name="adn"
                        size={16}
                        style={MainStyles.profileTextItemIcon}
                      />
                      <Text style={MainStyles.PTIText}>
                        {this.state.userData.headline}{" "}
                      </Text>
                    </View>
                    <View style={MainStyles.profileTextItem}>
                      <Icon
                        name="briefcase"
                        size={16}
                        style={MainStyles.profileTextItemIcon}
                      />
                      <Text style={MainStyles.PTIText}>
                        {this.state.userData.current_position}{" "}
                      </Text>
                    </View>
                    <View style={MainStyles.profileTextItem}>
                      <Icon
                        name="camera-retro"
                        size={16}
                        style={MainStyles.profileTextItemIcon}
                      />
                      <View
                        style={{ alignItems: "flex-start", flexWrap: "wrap" }}
                      >
                        {this.state.userData.interests.length > 0 && (
                          <View
                            style={{
                              flex: 9,
                              flexDirection: "row",
                              flexWrap: "wrap",
                              alignItems: "center",
                              justifyContent: "flex-start"
                            }}
                          >
                            {this.state.userData.interests.map((item, key) => (
                              <View
                                key={key}
                                style={{
                                  backgroundColor: "#0846b8",
                                  paddingVertical: 5,
                                  paddingHorizontal: 10,
                                  borderColor: "#0846b8",
                                  borderRadius: 30,
                                  borderWidth: 1,
                                  textAlign: "center",
                                  margin: 2
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#FFF",
                                    fontFamily: "Roboto-Regular",
                                    fontSize: 13
                                  }}
                                >
                                  {item.tag_name}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      marginVertical: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 70
                    }}
                  >
                    {this.state.userData.ID != this.state.userID && (
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: 40,
                          paddingVertical: 20,
                          borderRadius: 35,
                          backgroundColor: "#0947b9"
                        }}
                        onPress={() => {
                          this.startPrivateChat(this.state.userData.ID);
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFF",
                            fontFamily: "Roboto-Regular",
                            fontSize: 18
                          }}
                        >
                          CHAT
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </Dialog>
      </SafeAreaView>
    );
  }
}
