import React,{Component} from 'react';
import { View,Text,TouchableOpacity,
    FlatList,TextInput,Image, Keyboard,ActivityIndicator,
    AsyncStorage,
    Platform,KeyboardAvoidingView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from '../StyleSheet';
import Loader from '../Loader';
import { SERVER_URL } from '../../Constants';
import ChatItem from './ChatItem';
var clearTime = ''
class EventChatScreen extends Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            event_id:this.props.navigation.getParam('event_id'),
            event_note:this.props.navigation.getParam('note'),
            disableBtn:true,
            newMessage:'',
            isloadingMsgs:true,
            messages:{}
        }
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount() {
        this._isMounted = true;
        this.setUserId();
        setTimeout(()=>{this.update()},200);
    }
    onStartTyping(newMessage){
        if(newMessage && newMessage.length >= 1){
            this.setState({disableBtn:false,newMessage})
        }
        else {
            this.setState({disableBtn:true})
        }
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
    }
    renderMsgItem(item,userID){
        return <ChatItem msgItem={item} userID={userID}/>
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
            .then((response) => response.json())
            .then((responseData) => {
            })
            .done();
        }
    }
    /**
    * Rendering Chat Screen
    */

    render(){
        const enableBtn = this.state.disableBtn?MainStyles.MsgBtnDisable:MainStyles.MsgBtnEnable;
        let behavior = '';
        if(Platform.OS == 'ios'){
            behavior = 'padding';
        }
        return(
            <View style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View>
                    <View style={[MainStyles.eventsHeader,{justifyContent:'center'}]}>
                        <TouchableOpacity style={{alignItems:'center',flexDirection:'row', paddingLeft: 12 }} onPress={() => this.props.navigation.goBack() }>
                            <Icon name="chevron-left" style={{ fontSize: 20, color: '#8da6d5' }} />
                            <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>GROUP CHAT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[MainStyles.tabContainer,{justifyContent:'flex-start',paddingHorizontal:15,paddingVertical:15}]}>
                        <Text style={{fontSize:16,fontFamily:'Roboto-Medium',color:'#05296d'}}>Note: {this.state.event_note}</Text>
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
            </View>
        );
    }
}

export default EventChatScreen;