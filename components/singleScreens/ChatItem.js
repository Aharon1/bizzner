import React,{Component} from 'react';
import { View,Text,StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import ProgressiveImage from '../AsyncModules/ImageComponent';
import MainStyles from "../StyleSheet";
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import Icon from "react-native-vector-icons/FontAwesome";
class ChatItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
          profileDetailShow: false,
        };
    }
    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    render(){
        const {msgItem,userID} = this.props;
        const isMyMsg = (msgItem.send_by == userID)?true:false;
        return (
            <View style={Styles.msgContainer}>
                {
                    isMyMsg == false
                    &&
                    <TouchableOpacity style={Styles.AvatarCont}>
                        <ProgressiveImage source={{uri:msgItem.send_user_pic}} style={Styles.msgAvatar} />
                    </TouchableOpacity>
                }
                
                <View style={[Styles.msgTextCont,isMyMsg?{justifyContent:'flex-end',alignItems:'flex-end'}:'']}>
                    <View style={{flexDirection:'row'}}>
                        {
                            isMyMsg == false
                            && 
                            <Text style={Styles.msgSenderName}>{msgItem.send_user_name},</Text>
                        }
                        
                        <Text style={Styles.msgSenderName}>{this.formatAMPM(new Date(msgItem.send_on))}</Text>
                    </View>
                    <View style={isMyMsg?{justifyContent:'flex-end',alignItems:'flex-end'}:''}>
                        <Text style={[Styles.msgText,isMyMsg?{borderTopRightRadius:0,borderTopLeftRadius:5}:'']}>{msgItem.msg_text}</Text>
                    </View>
                </View>
                {/*
                    isMyMsg == true
                    &&
                    <View style={Styles.AvatarCont}>
                        <ProgressiveImage source={require('../../assets/dummy.jpg')} style={Styles.msgAvatar}/>
                    </View>
                */}
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
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    msgContainer:{
        flexDirection:'row',
        padding:15
    },
    msgTextCont:{
        flex:1,
        flexDirection:'column',
        marginHorizontal: 10,
        borderRadius: 5,
    },
    msgSenderName:{
        color:'#2f4d85',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
    },
    msgText:{
        fontFamily:'Roboto-Light',
        color:'#03163a',
        fontSize:14,
        backgroundColor: '#e8edf7',
        padding:10,
        borderRadius:5,
        marginTop:10,
        borderTopLeftRadius: 0,
        alignSelf: 'flex-start'
    },
    AvatarCont:{
        width:60,
        height:60,
    },
    msgAvatar:{
        width:60,
        height:60,
        borderWidth: 3,
        borderColor: '#FFF',
        borderRadius:50
    },
})
export default ChatItem;