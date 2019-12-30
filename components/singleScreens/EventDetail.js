import React, { Component } from "react";
import {
  View, Text, TouchableOpacity, FlatList, ActivityIndicator, Share, Alert, KeyboardAvoidingView, TextInput, ImageBackground,
  AsyncStorage, RefreshControl, ScrollView, SafeAreaView, Platform, Picker, ActionSheetIOS
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MainStyles from "../StyleSheet";
import { SERVER_URL } from "../../Constants";
import ProgressiveImage from "../../components/AsyncModules/ImageComponent";
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import Toast from "react-native-simple-toast";
import { MapForEventDetail } from "./MapForDetails";
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import Footer from '../Navigation/Footer';
import DatePicker from 'react-native-datepicker';
import HardText from "../../HardText";
import { loadingChange, ShowSearchAction } from '../../Actions';
import { connect } from 'react-redux';
import Axios from 'axios';
class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event_id: this.props.navigation.getParam("event_id"),
      userList: {},
      curStatus: "",
      eventData: "",
      isRefreshing: false,
      profileDetailShow: false,
      profilePicture: "",
      isLoadingProfile: true,
      userData: [],
      isMapShow: true,
      EditEventVisible: false
    };
    this.fetchNewDetails = this._fetchNewDetails.bind(this);
    this.fetchUserData = this._fetchUserData.bind(this);
    //this.getEventUsers();
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 95
    }
  }
  componentDidMount() {
    this.fetchNewDetails();
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
      }, () => {
        this.fetchNewDetails();
      });
    }
  }
  _fetchNewDetails() {
    this.props.loadingChangeAction(true);
    var user_id = this.props.reducer.userData;
    var eventId = this.state.event_id;
    Axios.get(`${SERVER_URL}?action=getEventUsers&event_id=${eventId}&user_id=${user_id}`)
      .then(res => {
        console.log(res.data);
        let { event_data, users, curStatus } = res.data;
        let no_Attendees = '';
        if (event_data.usersPlace == 10) {
          no_Attendees = '5-10';
        }
        else if (event_data.usersPlace == 15) {
          no_Attendees = '10-15';
        }
        else if (event_data.usersPlace == 20) {
          no_Attendees = '15-20';
        }
        this.setState({
          isRefreshing: false,
          userList: users,
          eventData: event_data,
          curStatus: curStatus,
          NES: event_data.event_subject,
          NEN: event_data.event_note,
          NEUsersCount: event_data.usersPlace,
          NED: event_data.event_date,
          NET: event_data.event_time,
          no_Attendees
        }, () => {
          this.props.loadingChangeAction(false);
        });
      }).catch(err => {
        setTimeout(() => { Toast.show(err.message, Toast.SHORT) }, 200);
        this.props.loadingChangeAction(false);
      });
  }
  formatAMPM(date) {
    var dateJS = new Date(date);
    var hours = dateJS.getHours();
    var minutes = dateJS.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  formatDate(date) {
    let dateJS = new Date(date);
    let dateStr = "";
    dateStr +=
      dateJS.getDate() < 10 ? "0" + dateJS.getDate() + " " : dateJS.getDate() + " ";
    let monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = monthArray[dateJS.getMonth()];
    dateStr += month + " ";
    dateStr += dateJS.getFullYear();
    return dateStr;
  }
  setUserEventStatus = async statusValue => {
    if (statusValue != this.state.curStatus) {
      if (statusValue != 3) {
        Alert.alert(
          'Add to Calendar?',
          'It will remind you',
          [
            {
              text: 'No',
              onPress: () => {
                this.setEventStatusOnServer(statusValue);
              },
              style: 'cancel',
            },
            {
              text: 'Yes', onPress: () => {
                var m = moment(new Date(this.state.eventData.event_date_formated));
                var mUTC = m.utc();
                const eventConfig = {
                  title: this.state.eventData.event_subject,
                  startDate: this.utcDateToString(mUTC),
                  endDate: this.utcDateToString(moment.utc(mUTC).add(2, 'hours')),
                  notes: 'tasty!',
                  navigationBarIOS: {
                    tintColor: '#416bb9',
                    backgroundColor: '#8da6d5',
                    titleColor: '#2e4d85',
                  },
                };
                AddCalendarEvent.presentEventCreatingDialog(eventConfig)
                  .then((eventInfo) => { this.setEventStatusOnServer(statusValue) })
                  .catch((error) => { console.warn(error); });
              }
            }],
          { cancelable: true },
        );
      }
      else {
        if (this.state.curStatus == statusValue) {
          statusValue = 0;
        }
        this.setEventStatusOnServer(statusValue);
      }
    }
    else {
      if (this.state.curStatus == statusValue) {
        statusValue = 0;
      }
      this.setEventStatusOnServer(statusValue);
    }
  };
  setEventStatusOnServer(statusValue) {
    var curItem = this.state.eventData;
    var user_id = this.props.reducer.userData;
    Axios.get(`${SERVER_URL}?action=changeUserEventStatus&user_id=${user_id}&event_id=${curItem.group_id}&status=${statusValue}`)
      .then(response => {
        this.fetchNewDetails();
        curStatus = statusValue;
        this.setState({ curStatus: statusValue }, () => {
          if (statusValue == 1) {
            Toast.show('You are interested to this event', Toast.SHORT);
          }
          else if (statusValue == 2) {
            Toast.show('You are joined to this event', Toast.SHORT);
          }
          else if (statusValue == 3) {
            Toast.show('You have ignored this event', Toast.SHORT);
          }
        });

      }).cathc(err => {
        setTimeout(() => {
          Toast.show(err.message, Toast.SHORT);
        }, 200);
      })
  }
  _fetchUserData = user_id => {
    this.setState({ isLoadingProfile: true, profileDetailShow: true });
    this.props.loadingChangeAction(true);
    Axios.get(SERVER_URL + "?action=get_user_data&user_id=" + user_id)
      .then(res => {
        let { body } = res.data;
        this.setState({ userData: body, isLoadingProfile: false }, () => { this.props.loadingChangeAction(false); });
      })
      .catch(err => {
        setTimeout(() => { Toast.show(err.message, Toast.SHORT); }, 200)
        this.props.loadingChangeAction(false);
      });
  };
  startPrivateChat(other_user_id) {
    this.props.loadingChangeAction(true);
    Axios.get(`${SERVER_URL}?action=startPrivateChat&user_id=${this.props.reducer.userData}&privateUserId=${other_user_id}`)
      .then(res => {
        let { privateChatId } = res.data;
        this.setState({ profileDetailShow: false }, () => { this.props.loadingChangeAction(false); });
        this.props.navigation.navigate("Private Chat", {
          event_id: privateChatId
        });
      })
      .catch(err => {
        this.props.loadingChangeAction(false);
      });
  }
  closeMap = () => {
    this.setState({ isMapShow: false });
  }
  showMap = () => {
    this.setState({ isMapShow: true });
  }
  utcDateToString = (momentInUTC) => {
    let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return s;
  };
  async shareThis() {
    try {
      const result = await Share.share({
        message: this.state.eventData.event_subject + '  http://bizzner.com/event/' + this.state.event_id + ' ',
      }, {
        dialogTitle: 'Share ' + this.state.eventData.event_subject,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Toast.show(error.message, Toast.SHORT);
    }
  }
  deleteEvent() {
    var curEvent = this.state.event_id;
    Alert.alert(
      'You want to cancle this event?',
      'This event will be canceled & notify to users',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            Axios.get(`${SERVER_URL}?action=cancel_event&event_id=${curEvent}`)
              .then(response => {
                this.props.navigation.navigate('Current Events');
              })
              .catch(err => {
                Toast.show(err.message, Toast.SHORT);
              })
          }
        }
      ],
      { cancelable: true },
    );
  }
  updateEvent = () => {
    this.props.loadingChangeAction(true);
    Axios.get(`${SERVER_URL}?action=edit_event&event_id=${this.state.event_id}&event_subject=${this.state.NES}&event_note=${this.state.NEN}&user_place=${this.state.NEUsersCount}&event_date=${this.state.NED}&event_time=${this.state.NET}`)
      .then(res => {
        let { message, event_data } = res.data;
        Toast.show(message, Toast.SHORT);
        this.setState({ eventData: event_data, EditEventVisible: false }, () => {
          this.props.loadingChangeAction(false);
        });
      })
      .catch(err => {
        this.props.loadingChangeAction(false);
        SetTimeout(() => {
          Toast.show(err.message, Toast.SHORT);
        }, 200);
      })
  }
  pickerIos = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', '5-10', '10-15', '15-20'],
      cancelButtonIndex: 0,
    },
      (buttonIndex) => {
        let NEUsersCount = 0, no_Attendees = '';
        if (buttonIndex === 1) {
          NEUsersCount = 10;
          no_Attendees = '5-10';
        }
        else if (buttonIndex === 2) {
          NEUsersCount = 10;
          no_Attendees = '10-15';
        }
        else if (buttonIndex === 3) {
          NEUsersCount = 20;
          no_Attendees = '15-20';
        }
        this.setState({ NEUsersCount: 20, no_Attendees: '15-20' });
      });
  }
  render() {
    var behavior = (Platform.OS == 'ios') ? 'padding' : '';
    const { location } = this.props.navigation.state.params;
    var bottomPadding = (Platform.OS == 'ios') ? 47 : 47;
    return (
      <View style={[MainStyles.normalContainer]}>
        <View style={{ flex: 1 }}>
          <View style={[MainStyles.tabContainer, {
            elevation: 0,
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "column"
          }
          ]} >
            <View
              style={{
                justifyContent: "space-around",
                width: "100%",
                marginBottom: 10,
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity style={[MainStyles.tabItem, MainStyles.tabItemActive]}
                onPress={() => this.props.navigation.navigate("EventDetail", { event_id: this.state.event_id }) }
            >
                <Icon name="user-plus" style={[MainStyles.tabItemIcon, MainStyles.tabItemActiveIcon, { fontSize: 14 }]} />
              <Text style={[MainStyles.tabItemIcon, MainStyles.tabItemActiveText, { fontSize: 14, fontFamily: 'Roboto-Medium' }]}>
                {HardText.invited_to_event}
              </Text>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.shareThis() }} style={[MainStyles.tabItem]}>
              <Icon name="share-alt" style={[MainStyles.tabItemIcon, { fontSize: 14 }]} />
              <Text style={[MainStyles.tabItemIcon, { fontSize: 14, fontFamily: 'Roboto-Medium' }]}>
                {HardText.event_share}
              </Text>
            </TouchableOpacity>
            {this.state.curStatus != "" && (
              <TouchableOpacity
                style={MainStyles.tabItem}
                onPress={() =>
                  this.props.navigation.navigate("Event Chat", {
                    event_id: this.state.event_id,
                    note: this.state.eventData.event_note,
                    subject: this.state.eventData.event_subject
                  })
                }
              >
                <Icon name="comments" style={[MainStyles.tabItemIcon, { color: '#22A54D', fontSize: 14 }]} />
                <Text style={[MainStyles.tabItemIcon, { color: '#22A54D', fontSize: 14, fontFamily: 'Roboto-Medium' }]}>
                  {HardText.event_chat}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {this.state.isMapShow && (
            <View style={{ width: '50%' }}>
              <MapForEventDetail location={location} closeMap={this.closeMap} />
            </View>
          )}
          {this.state && this.state.eventData != "" &&
            <View style={{
              backgroundColor: '#fff',
              width: '50%',
              paddingVertical: 5,
              paddingHorizontal: 15,
              justifyContent: 'space-between'
            }}>
              <View style={{ justifyContent: 'flex-start', paddingRight: 10, flexDirection: 'column' }}>
                <Text style={{ color: '#39b54a', fontFamily: 'Roboto-Medium', fontSize: 13, flexWrap: 'wrap', textAlign: 'left' }}>{this.state.eventData.event_subject}</Text>
                <Text style={{ color: '#03163a', fontFamily: 'Roboto-Regular', fontSize: 13, flexWrap: 'wrap', textAlign: 'left', marginTop: 5 }}>{this.state.eventData.group_name}</Text>
                <Text style={{ fontFamily: 'Roboto-Light', fontSize: 13, textAlign: 'left' }}>{this.state.eventData.group_address}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 5 }}>
                  <Icon name="thumb-tack" style={{ color: '#8da6d5', marginRight: 5 }} size={13} />
                  <Text style={{ color: '#03163a', fontFamily: 'Roboto-Light', fontSize: 13, flexWrap: 'wrap', textAlign: 'left' }}>{this.state.eventData.event_note}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Icon name="clock-o" style={{ color: '#8da6d5', marginRight: 5 }} size={13} />
                  <Text style={{ color: '#03163a', fontFamily: 'Roboto-Light', fontSize: 13, flexWrap: 'wrap', textAlign: 'left' }}>{this.state.eventData.event_date_formated}</Text>
                </View>
              </View>
              {
                this.props.reducer.userData == this.state.eventData.created_by &&
                <View style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginVertical: 10
                }}>
                  <TouchableOpacity onPress={() => this.setState({ EditEventVisible: true })} style={{ marginRight: 15, alignItems: 'center' }}>
                    <Icon name="pencil" style={{ color: '#8da6d5' }} size={17} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.deleteEvent() }}>
                    <Icon name="trash" style={{ color: '#8da6d5' }} size={17} />
                  </TouchableOpacity>
                </View>
              }
            </View>
          }
        </View>
        {
          (this.state.curStatus != 1
            ||
            this.state.curStatus != 2
            ||
            this.state.curStatus != 3)
          &&
          this.state.eventData.usersCount < this.state.eventData.usersPlace
          &&
          <View style={[MainStyles.EventScreenTabWrapper, {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#c6d2e9',
            borderTopWidth: 1,
            shadowRadius: 5,
            shadowOpacity: 0.8,
            shadowOffset: { width: 5, height: 5 },
            elevation: 5,
            shadowColor: '#232323',
          }]}>
            <TouchableOpacity style={[
              MainStyles.EIAButtons, {
                borderRadius: 0, paddingHorizontal: 10,
                paddingVertical: 10
              }
            ]}
              onPress={() => this.setUserEventStatus(2)}
            >
              <Icon name="check" size={15} style={{ color: '#87d292', marginRight: 5 }} />
              {
                this.state.curStatus != 2 &&
                <Text style={{
                  color: '#87d292',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 14
                }}>{HardText.event_join}</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={[
              MainStyles.EIAButtons, {
                marginHorizontal: 5, borderRadius: 0, paddingHorizontal: 10,paddingVertical: 10},
            ]}
              onPress={() => this.setUserEventStatus(1)}
            >
              <Icon name="star" size={15} style={{ color: '#8da6d5', marginRight: 5 }} />
              {
                this.state.curStatus != 1 &&
                <Text style={{
                  color: '#8da6d5',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 14
                }}>{HardText.event_interested}</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={[
              MainStyles.EIAButtons, {
                borderRadius: 0, paddingHorizontal: 10,
                paddingVertical: 10
              }]}
              onPress={() => this.setUserEventStatus(3)}
            >
              <Icon name="ban" size={15} style={{ color: '#8da6d5', marginRight: 5, }} />
              <Text style={{
                color: '#8da6d5',
                fontFamily: 'Roboto-Medium',
                fontSize: 14
              }}>{HardText.event_ignore}</Text>
            </TouchableOpacity>
          </View>
        }
        {
          this.state.eventData.usersCount == 0
          &&
          this.state.curStatus != 1
          &&
          this.state.curStatus != 2
          &&
          this.state.curStatus != 3
          &&
          this.state.eventData.usersCount == this.state.eventData.usersPlace
          &&
          <View style={[{ paddingVertical: 5, backgroundColor: '#8da6d4', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#FFF', fontFamily: 'Roboto-Medium', fontSize: 15 }}>{HardText.event_no_place}</Text>
          </View>
        }
        {this.state && this.state.userList && this.state.userList.length > 0 && (
          <FlatList
            contentContainerStyle={{ paddingBottom: bottomPadding }}
            data={this.state.userList}
            renderItem={({ item }) => (
              <View style={[MainStyles.UserListItem]}>
                <TouchableOpacity
                  style={MainStyles.userListItemImageWrapper}
                  onPress={() => this.fetchUserData(item.user_id)}
                >
                  <ProgressiveImage
                    source={{ uri: item.originalPic }}
                    style={MainStyles.userListItemIWImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View style={MainStyles.userListItemTextWrapper}>
                  <Text style={MainStyles.ULITWName}>{item.name}</Text>
                  <Text style={MainStyles.ULITWTitle}>{item.title}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {item.status == "1" && (
                      <View style={[MainStyles.ULITWAction,{ borderColor: "#8da6d5" }]} >
                        <Icon name="star" style={[MainStyles.ULITWActionIcon, { color: '#8da6d5' }]} />
                        <Text style={[MainStyles.ULITWActionText, { color: '#8da6d5' }]}>{HardText.e_i_caps}</Text>
                      </View>
                    )}
                    {item.status == "2" && (
                      <View style={MainStyles.ULITWAction}>
                        <Icon name="check" style={MainStyles.ULITWActionIcon} />
                        <Text style={MainStyles.ULITWActionText}>{HardText.e_a_caps}</Text>
                      </View>
                    )}
                    {this.state.eventData.created_by == item.user_id && (
                      <View style={[MainStyles.ULITWAction,{ borderColor: "#8da6d5", marginLeft: 15 }]}>
                        <Icon name="user" style={[MainStyles.ULITWActionIcon, { color: '#8da6d5' }]} />
                        <Text style={[MainStyles.ULITWActionText, { color: '#8da6d5' }]}>{HardText.e_o_caps}</Text>
                      </View>
                    )}
                  </View>

                </View>
                {item.user_id != this.props.reducer.userData && (
                  <TouchableOpacity
                    style={MainStyles.ChatIconWrapper}
                    onPress={() => {
                      this.startPrivateChat(item.user_id);
                    }}
                  >
                    <Icon name="comment-o" style={MainStyles.ChatIcon} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => {
                  this.setState({ isRefreshing: true },()=>{
                    this.fetchNewDetails();
                  });
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
      </View>
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
            {HardText.profile_details}
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
                      source={{ uri: this.state.userData.user_pic_full }}
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
                <View style={{ paddingHorizontal: 40, flex: 1 }} >
                  <View style={MainStyles.profileTextItem}>
                    <Icon name="map-marker" size={16} style={MainStyles.profileTextItemIcon} />
                    <Text style={MainStyles.PTIText}>
                      {this.state.userData.country}{" "}
                    </Text>
                  </View>
                  <View style={MainStyles.profileTextItem}>
                    <Icon name="adn" size={16} style={MainStyles.profileTextItemIcon} />
                    <Text style={MainStyles.PTIText}>
                      {this.state.userData.headline}{" "}
                    </Text>
                  </View>
                  <View style={MainStyles.profileTextItem}>
                    <Icon name="briefcase" size={16} style={MainStyles.profileTextItemIcon} />
                    <Text style={MainStyles.PTIText}>
                      {this.state.userData.current_position}{" "}
                    </Text>
                  </View>
                  <View style={MainStyles.profileTextItem}>
                    <Icon name="camera-retro" size={16} style={MainStyles.profileTextItemIcon} />
                    <View style={{ alignItems: "flex-start", flexWrap: "wrap" }} >
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
                  {this.state.userData.ID != this.props.reducer.userData && (
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
                        {HardText.e_p_chat}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Dialog>
      <Dialog
        visible={this.state.EditEventVisible}
        dialogStyle={[MainStyles.confirmPopup, { width: '95%', padding: 0, maxHeight: '95%' }]}
        dialogAnimation={new SlideAnimation()}
        containerStyle={{ zIndex: 10, flex: 1, justifyContent: 'space-between', }}
        rounded={false}
      >
        <View style={[MainStyles.confirmPopupHeader, { alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', backgroundColor: '#416bb9' }]}>
          <TouchableOpacity onPress={() => { this.setState({ EditEventVisible: false, isLocationSet: false, curLocation: {} }) }}>
            <Icon name="times" style={{ fontSize: 20, color: '#FFF' }} />
          </TouchableOpacity>
          <Text style={{ color: '#FFF', fontFamily: 'Roboto-Medium', fontSize: 17, marginLeft: 20 }}>{HardText.edit_event}</Text>
        </View>
        <View style={{ padding: 0, borderWidth: 0, backgroundColor: '#FFF', overflow: 'visible' }}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: true });
          }}
        >
          <KeyboardAvoidingView behavior={behavior}>
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={{
                paddingHorizontal: 0,
              }}
              scrollEnabled={this.state.enableScrollViewScroll}
              ref={myScroll => (this._myScroll = myScroll)}
            >
              <View style={{ width: '100%', marginTop: 0, marginBottom: 0, height: 150, }}>
                <ImageBackground source={{ uri: this.state.eventData.photoUrl }} style={{ width: '100%', height: 150, flex: 1, resizeMode: 'center' }} resizeMode="cover">
                  <View style={{
                    color: 'white',
                    position: 'absolute', // child
                    bottom: 0, // position where you want
                    left: 0,
                    paddingLeft: 20,
                    paddingRight: 40,
                    paddingBottom: 20
                  }}>
                    <Text style={{ textAlign: 'left', color: '#FFF', fontFamily: 'Roboto-Regular', fontSize: 18 }}>{this.state.eventData.group_name}</Text>
                    <Text style={{ textAlign: 'left', color: '#FFF', fontFamily: 'Roboto-Light', fontSize: 16 }}>{this.state.eventData.group_address}</Text>
                  </View>
                </ImageBackground>
              </View>
              <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                <View style={[MainStyles.createEventFWI]}>
                  <Icon name="thumb-tack" style={MainStyles.cEFWIIcon} />
                  <TextInput style={MainStyles.cEFWITF} placeholder="Subject" value={this.state.NES} onChangeText={(text) => { this.setState({ NES: text }) }} returnKeyType="next" placeholderTextColor="#03163a" underlineColorAndroid="transparent" />
                </View>
                <View style={MainStyles.createEventFWI}>
                  <Icon name="bell" style={MainStyles.cEFWIIcon} />
                  <TextInput style={MainStyles.cEFWITF} value={this.state.NEN} placeholder="Note" onChangeText={(text) => { this.setState({ NEN: text }) }} returnKeyType="next" placeholderTextColor="#03163a" underlineColorAndroid="transparent" />
                </View>
                <View style={MainStyles.createEventFWI}>
                  <Icon name="users" style={MainStyles.cEFWIIcon} />
                  {
                    Platform.OS == 'android' &&
                    <Picker
                      selectedValue={this.state.NEUsersCount}
                      returnKeyType="next"
                      style={MainStyles.cEFWIPF}
                      textStyle={{ fontSize: 17, fontFamily: 'Roboto-Light' }}
                      itemTextStyle={{
                        fontSize: 17, fontFamily: 'Roboto-Light',
                      }}
                      itemStyle={[MainStyles.cEFWIPF, { fontSize: 17, fontFamily: 'Roboto-Light' }]}
                      onValueChange={(itemValue, itemIndex) => this.setState({ NEUsersCount: itemValue })}>
                      <Picker.Item label="Number of Attendees" value="" />
                      <Picker.Item label="5-10" value="10" />
                      <Picker.Item label="10-15" value="15" />
                      <Picker.Item label="15-20" value="20" />
                    </Picker>
                  }
                  {
                    Platform.OS == 'ios' &&
                    <TouchableOpacity style={[MainStyles.cEFWITF, { alignItems: 'center' }]} onPress={() => { this.pickerIos() }}>
                      <Text style={{ color: '#03163a', fontFamily: 'Roboto-Light' }}>{this.state.no_Attendees}</Text>
                    </TouchableOpacity>

                  }
                </View>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                  <View style={MainStyles.createEventFWI}>
                    <Icon name="calendar" style={MainStyles.cEFWIIcon} />
                    <DatePicker
                      style={{ width: '75%' }}
                      date={this.state.NED}
                      mode="date"
                      placeholder="Select Date"
                      format="DD/MM/YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      onDateChange={(date) => { this.setState({ NED: date }) }}
                      customStyles={{
                        dateInput: MainStyles.cEFWIDF
                      }}
                    />
                  </View>
                  <View style={[MainStyles.createEventFWI]}>
                    <Icon name="clock-o" style={MainStyles.cEFWIIcon} />
                    <DatePicker
                      style={{ width: '75%' }}
                      date={this.state.NET}
                      mode="time"
                      placeholder="Select Time"
                      format="HH:mm"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      onDateChange={(time) => {
                        var curTime = new Date();
                        var choosenDate = this.state.NED.split('/');
                        var tim30More = new Date((choosenDate[1]) + "/" + choosenDate[0] + "/" + choosenDate[2] + " " + time + ':00');
                        var minutes = (tim30More.getTime() - curTime.getTime()) / (60 * 1000);
                        if (minutes > 30) {
                          this.setState({ NET: time })
                        }
                        else {
                          setTimeout(() => {
                            if (Platform.OS == 'ios') {
                              AlertIOS.alert(
                                "Warning",
                                "Please give at least 30 minutes notice before event starts"
                              );
                            }
                            else {
                              Toast.show("Please give at least 30 minutes notice before event starts", Toast.LONG)
                            }
                          }, 400)

                        }
                      }}
                      customStyles={{
                        dateInput: MainStyles.cEFWIDF
                      }}
                    />
                  </View>
                </View>
                <View style={[MainStyles.btnWrapper, { marginBottom: 20 }]}>
                  <TouchableOpacity style={[MainStyles.btnSave]} onPress={() => this.updateEvent()}>
                    <Text style={MainStyles.btnSaveText}>{HardText.save}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Dialog>
      <Footer showSearch={false} navigation={this.props.navigation} />
      </View >
    );
  }
}
const mapStateToProps = (state) => {
  const { reducer } = state
  return { reducer }
};
const mapDispatchToProps = dispatch => ({
  loadingChangeAction: (dataSet) => dispatch(loadingChange(dataSet)),
  ShowSearch: (open) => dispatch(ShowSearchAction(open))
});
export default connect(mapStateToProps, mapDispatchToProps)(EventDetail);