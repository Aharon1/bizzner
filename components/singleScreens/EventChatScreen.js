import React,{Component} from 'react';
import { View,Text,TouchableOpacity,
    FlatList,TextInput,Image, Keyboard,ActivityIndicator,
    AsyncStorage,SafeAreaView,ScrollView,
    Platform,KeyboardAvoidingView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from '../StyleSheet';
import Loader from '../Loader';
import { SERVER_URL } from '../../Constants';
import ChatItem from './ChatItem';
import Dialog, { SlideAnimation } from "react-native-popup-dialog";
import ProgressiveImage from '../AsyncModules/ImageComponent';
import HardText from '../../HardText';
var clearTime = ''
class EventChatScreen extends Component{
    _isMounted = false;clearTimeR = '';
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            event_id:this.props.navigation.getParam('event_id'),
            event_note:this.props.navigation.getParam('note'),
            event_subject:this.props.navigation.getParam('subject'),
            disableBtn:true,
            newMessage:'',
            isloadingMsgs:true,
            messages:{},
            profileDetailShow: false,
            isLoadingProfile: true
        }
        this.readMsgs = this._readMsgs.bind(this);
        this.fetchUserData = this._fetchUserData.bind(this);
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount() {
        this._isMounted = true;
        this.setUserId();
        setTimeout(()=>{
            this.readMsgs();
            this.clearTimeR = setInterval(()=>{
                this.readMsgs();
            },2000)
            this.update()
        },200);
    }
    onStartTyping(newMessage){
        if(newMessage && newMessage.length >= 1){
            this.setState({disableBtn:false,newMessage})
        }
        else {
            this.setState({disableBtn:true})
        }
    }
    _readMsgs = async ()=>{
        fetch(SERVER_URL+'?action=readMsg&chat_id='+this.state.event_id+'&isgrp=1&userId='+this.state.userID)
        .then(response=>{
        })
        .catch(err=>{
            console.log(err);
        });
        
    }
    sendMsg(){
        const msgs = this.state.messages;
        const nMsg = {
            msgBy:1,
            key:'key-'+msgs.length+1,
            name:'Terrorist',
            time:'03:47:00',
            text:this.state.text
        }
        msgs.unshift(nMsg);
        this.setState({disableBtn:true,messages:msgs})
        this.textInput.clear();
        Keyboard.dismiss();
    }
    getMessages() {
        fetch(SERVER_URL + '?action=getEventMessages&event_id='+this.state.event_id)
          .then((response) => response.json())
          .then((responseData) => {
            if (this._isMounted) {
                if(responseData.code == 200){
                    var messagesCopy = responseData.body.messages;
                    var oldMessagesNumber = this.state.messages.length;
                    messagesCopy.reverse();
                    this.setState({
                        messages: messagesCopy,
                    });
                    if (oldMessagesNumber < messagesCopy.length)
                        this.scrollToTheBottom();
                }
                this.setState({isloadingMsgs:false});
            }
        })
        .done();
    }
    update() {
        this.getMessages();
        clearTime = setInterval(
          () => {this.getMessages();},
          1000
        );
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(clearTime);
        clearInterval(this.clearTimeR)
    }
    renderMsgItem(item,userID){
        return <ChatItem msgItem={item} userID={userID} fetchUserData={this.fetchUserData}/>
    }
    keyExtractor = (item,index) => item.key;
    /********
     * Scrolling to Bottom
    */
    scrollToTheBottom() {
        this.list.getScrollResponder().scrollTo({x:0,y:0,animate:true});
    }
    /********
     * Sending Message To Database
    */
    sendNewMessage() {
        var message = this.state.newMessage;
        if (message) {
            var newDate = new Date();
            this.refs['newMessage'].setNativeProps({text: ''});
            if(this.state.messages.length > 0){
                var messagesCopy = this.state.messages.slice();
                for (var i = messagesCopy.length; i > 0; i--) {
                    messagesCopy[i] = messagesCopy[i - 1];
                }
                messagesCopy[0] = {
                    send_by:this.state.userID,
                    key:'key-'+messagesCopy.length+1,
                    send_on:newDate,
                    msg_text:message
                }
            }
            else{
                var messagesCopy = this.state.messages
                messagesCopy = {
                    send_by:this.state.userID,
                    key:'key-'+messagesCopy.length+1,
                    send_on:newDate,
                    msg_text:message
                }
            }
            this.setState({
                messages: messagesCopy,
                newMessage: '',
                disableBtn:true,
            });
            //Keyboard.dismiss();
            if(this.state.messages.length > 4){
                this.scrollToTheBottom();
            }
            fetch( SERVER_URL + '?action=msgSend&user_id='+this.state.userID+'&grp_id='+this.state.event_id+'&is_grp_msg=1&msg_text=' + message)
            .then((response) => {console.log(response);return response.json()})
            .then((responseData) => {
            })
            .done();
        }
    }
    /**
    * Rendering Chat Screen
    */
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
    render(){
        const enableBtn = this.state.disableBtn?MainStyles.MsgBtnDisable:MainStyles.MsgBtnEnable;
        let behavior = '';
        if(Platform.OS == 'ios'){
            behavior = 'padding';
        }
        return(
            <SafeAreaView style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View>
                    <View style={[MainStyles.eventsHeader,{justifyContent:'center'}]}>
                        <TouchableOpacity style={{alignItems:'center',flexDirection:'row', paddingLeft: 12 }} onPress={() => this.props.navigation.goBack() }>
                            <Icon name="chevron-left" style={{ fontSize: 20, color: '#8da6d5' }} />
                            <Text style={{fontSize:14,color:'#8da6d5',marginLeft:20}}>{HardText.event_chat}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[MainStyles.tabContainer,{justifyContent:'flex-start',paddingHorizontal:15,paddingVertical:15}]}>
                        <Text style={{fontSize:14,fontFamily:'Roboto-Medium',color:'#05296d'}}>{HardText.event_chat_subject} {this.state.event_subject}</Text>
                    </View>
                </View>
                <View style={{
                    backgroundColor:'#d1dbee',
                    flex:1
                }}>
                {
                    this.state.isloadingMsgs &&
                    <ActivityIndicator size="large"  color="#0947b9" animating={true} style={{marginTop:15}}/>
                }
                {
                    this.state.messages !='' && this.state.messages.length > 0
                    && 
                    <FlatList
                    ref= {ref => this.list = ref}
                    inverted
                    data={this.state.messages} 
                    renderItem={(items)=>{return this.renderMsgItem(items.item,this.state.userID)}}
                    keyExtractor= {this.keyExtractor}
                    />
                }
                </View>
                <KeyboardAvoidingView behavior={behavior}>
                    <View style={MainStyles.MessageContainerTextInput}>
                        <TextInput 
                            multiline
                            placeholder="Type a message here" 
                            style={{fontFamily:'Roboto-Regular',fontSize:15,color:'#8da6d5',flex:1,paddingHorizontal:10}} 
                            placeholderTextColor="#8da6d5"
                            onChangeText={(newMessage)=>this.onStartTyping(newMessage)}
                            ref = {'newMessage'}
                            text = {this.state.newMessage}
                        />
                        <TouchableOpacity onPress={this.sendNewMessage.bind(this)} style={[{justifyContent:'center',alignItems:'center'},enableBtn]} disabled={this.state.disableBtn}>
                            <Image source={require('../../assets/msg-icon.png')} style={[{width:47,height:40},enableBtn]}/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
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
                            </View>
                        )}
                        </ScrollView>
                    </View>
                </Dialog>
            </SafeAreaView>
        );
    }
}

export default EventChatScreen;