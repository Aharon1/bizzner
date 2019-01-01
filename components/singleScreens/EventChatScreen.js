import React,{Component} from 'react';
import { View,Text,TouchableOpacity,
    FlatList,TextInput,Image, Keyboard,ActivityIndicator,
    Platform,KeyboardAvoidingView} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { HeaderButton } from '../Navigation/HeaderButton';
import MainStyles from '../StyleSheet';
import Loader from '../Loader';
import { SERVER_URL } from '../../Constants';
import ChatItem from './ChatItem';

class EventChatScreen extends Component{
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
    componentDidMount() {
        this.update();
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
              console.log(responseData);
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
            })
          .done();
    }
    update() {
        this.getMessages();
        setInterval(
          () => {this.getMessages();},
          5000
        );
    }
    renderMsgItem({item}){
        return <ChatItem msgItem={item} />
    }
    keyExtractor = (item,index) => item.key;
    /********
     * Scrolling to Bottom
    */
    scrollToTheBottom() {
        this.refs.list.getScrollResponder().scrollTo({x:0,y:0,animate:true});
    }
    /********
     * Sending Message To Database
    */
    sendNewMessage() {
        var message = this.state.newMessage;
        if (message) {
            var newDate = new Date();
            var DateTime = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate()+' '+newDate.getHours()+':'+newDate.getMinutes()+':'+newDate.getSeconds();
            this.refs['newMessage'].setNativeProps({text: ''});
            var messagesCopy = this.state.messages.slice();
            for (var i = messagesCopy.length; i > 0; i--) {
                messagesCopy[i] = messagesCopy[i - 1];
            }
            messagesCopy[0] = {
                send_by:29,
                key:'key-'+messagesCopy.length+1,
                send_on:DateTime,
                msg_text:message
            }
            this.setState({
                //dataSource: this.state.dataSource.cloneWithRows(messagesCopy),
                messages: messagesCopy,
                newMessage: '',
                disableBtn:true,
            });
            Keyboard.dismiss();
            this.scrollToTheBottom();
            
            fetch(SERVER_URL + '?action=msgSend&user_id=29&grp_id='+this.state.event_id+'&is_grp_msg=1&msg_text=' + message+'&creation_date='+DateTime)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
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
                    <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                        <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                        <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>PRIVATE MESSAGE</Text>
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
                    <ActivityIndicator size="large"  color="#0947b9" animating={true} />
                }
                {
                    this.state.messages !='' && this.state.messages.length > 0
                    && 
                    <FlatList
                    ref= 'list'
                    inverted
                    data={this.state.messages} 
                    renderItem={this.renderMsgItem}
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