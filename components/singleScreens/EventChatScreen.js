import React,{Component} from 'react';
import { View,Text,TouchableOpacity,
    FlatList,TextInput,Image, Keyboard,
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
            disableBtn:true,
            text:'',
            messages:[
                {
                    msgBy:2,
                    key:'1',
                    name:'Axel Lionel Rozen',
                    time:'03:55:00',
                    text:'See I told you nobody will care about the 14 thousand people'
                },
                {
                    msgBy:1,
                    key:'2',
                    name:'Terrorist',
                    time:'03:49:00',
                    text:'Why a donkey?'
                },
                {
                    msgBy:2,
                    key:'3',
                    name:'Terrorist',
                    time:'03:47:00',
                    text:'We are planning to kill 14 thousand people and a donkey'
                }
            ]
        }
    }
    componentDidMount() {
        this.update();
    }
    onStartTyping(text){
        if(text && text.length >= 1){
            this.setState({disableBtn:false,text})
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
            var messagesCopy = responseData;
            var oldMessagesNumber = this.state.messages.length;
            messagesCopy.reverse();
            this.setState({
              messages: messagesCopy,
              dataSource: this.state.dataSource.cloneWithRows(messagesCopy),
            });
            /*if (oldMessagesNumber < messagesCopy.length)
              this.scrollToTheBottom();*/
          })
          .done();
    }
    update() {
        this.getMessages();
        this.setInterval(
          () => {this.getMessages();},
          5000
        );
    }
    renderMsgItem({item}){
        return <ChatItem msgItem={item} />
    }
    keyExtractor = (item,index) => item.key;
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
                        <Text style={{fontSize:16,fontFamily:'Roboto-Medium',color:'#05296d'}}>Note: pls came from the front green door</Text>
                    </View>
                </View>
                <View style={{
                    backgroundColor:'#d1dbee',
                    flex:1
                }}>
                    <FlatList
                    inverted
                    data={this.state.messages} 
                    renderItem={this.renderMsgItem}
                    keyExtractor= {this.keyExtractor}
                    />
                </View>
                
                <KeyboardAvoidingView behavior={behavior}>
                    <View style={MainStyles.MessageContainerTextInput}>
                        <TextInput 
                            multiline
                            placeholder="Type a message here" 
                            style={{fontFamily:'Roboto-Regular',fontSize:15,color:'#8da6d5',flex:1,paddingHorizontal:10}} 
                            placeholderTextColor="#8da6d5"
                            onChangeText={(text)=>this.onStartTyping(text)}
                            ref = {input =>{this.textInput = input} }
                        />
                        <TouchableOpacity onPress={this.sendMsg.bind(this)} style={[{justifyContent:'center',alignItems:'center'},enableBtn]} disabled={this.state.disableBtn}>
                            <Image source={require('../../assets/msg-icon.png')} style={[{width:47,height:40},enableBtn]}/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

export default EventChatScreen;