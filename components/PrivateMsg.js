import React, { Component } from 'react';
import { View,Text,TouchableOpacity, 
    Platform,FlatList,AsyncStorage,Image,
    RefreshControl,SafeAreaView,StyleSheet,Alert
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Loader from './Loader';
import { HeaderButton } from './Navigation/HeaderButton';
import {SERVER_URL} from '../Constants';
import ProgressiveImage from './AsyncModules/ImageComponent';
import HardText from '../HardText';
var clearTime = '';
class PrivatMsgScreen extends Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state={
            loading:true,
            chatList:{},
            isRefreshing:false,
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.fetchList = this._fetchList.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.hideChat = this._hideChat.bind(this);
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount(){
        this._isMounted = true;
        this.setUserId();
        setTimeout(()=>{
            this.fetchList();
            clearTime = setInterval(()=>{this.fetchList();},4000)
        },200)
    }
    _fetchList= async ()=>{
        await fetch(SERVER_URL+'?action=getPrivateList&user_id='+this.state.userID)
        .then(res=>res.json())
        .then(response=>{
            if (this._isMounted) {
                if(response.code != 404){
                    this.setState({chatList:response.body.results});
                }
                this.setState({loading:false,isRefreshing:false})
            }
        })
        .catch()
    }
    _refreshList(){
        this.fetchList()
    }
    formatAMPM(date) {
        var date = new Date(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    formatDate(date){
        var date = new Date(date);
        var dateStr = '';
        dateStr += (date.getDate() < 10)?'0'+date.getDate()+' ':date.getDate()+' ';
        var monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var month = monthArray[date.getMonth()];
        dateStr += month+' ';
        dateStr += date.getFullYear();
        return dateStr;
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(clearTime);
    }
    async _hideChat(chatId){
        await fetch(SERVER_URL+'?action=hide_user_chat&chat_id='+chatId+'&isgrp=0&user_id='+this.state.userID)
        .then(res=>res.json())
        .then(response=>{
            if(response.code ==200){
                Toast.show("Chat hidden successfully",Toast.SHORT);
            }
            this.fetchList();
        })
        .catch(err=>{

        });
    }
    render(){
        return(
            <SafeAreaView style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{justifyContent:'center'}]}>
                    <TouchableOpacity style={{alignItems:'center',flexDirection:'row', paddingLeft: 12 }} onPress={() => this.props.navigation.goBack() }>
                        <Icon name="chevron-left" style={{ fontSize: 20, color: '#8da6d5' }} />
                        <Text style={{fontSize:16,color:'#8da6d5',marginLeft:20}}>{HardText.chat_list}</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state && this.state.chatList && this.state.chatList.length > 0 && 
                    <FlatList 
                    data={this.state.chatList} 
                    renderItem={({item})=>{
                        var todaysDate = new Date();
                        var todaysFormated = todaysDate.getDate()+'/'+(todaysDate.getMonth()+1)+'/'+todaysDate.getFullYear();
                        var chatDate = new Date(item.send_on);
                        var chatDateFormated = chatDate.getDate()+'/'+(chatDate.getMonth()+1)+'/'+chatDate.getFullYear();
                        var dateFormated = (todaysFormated != chatDateFormated)?this.formatDate(item.send_on)+' '+this.formatAMPM(item.send_on):"Today "+this.formatAMPM(item.send_on);
                        console.log(item);
                        return (
                            <View>
                                { !item.isHidden && 
                                <TouchableOpacity style={[curStyle.UserListItem,
                                (item.unread_count > 0)?{backgroundColor:'rgba(209, 219, 237, 0.4)'}:''
                                ]} onPress={()=>{this.props.navigation.navigate('Private Chat',{event_id:item.chat_id})}}>
                                    <View style={{overflow:'hidden',width:60,height:60,borderWidth: 2,
                                            borderColor: '#FFF'}}>
                                        <ProgressiveImage source={{uri:item.user_pic}} style={{
                                            width: 60, 
                                            height:60,
                                        }} resizeMode="cover"/>
                                    </View>
                                    <View style={MainStyles.userListItemTextWrapper}>
                                        <Text style={[MainStyles.ULITWName,{fontFamily:'Roboto-Medium',color:'#416bb9'}]}>{item.name}</Text>
                                        <Text 
                                        style={{
                                            color:'#999',
                                            fontFamily:'Roboto-Regular',
                                            fontSize:8,
                                            marginBottom:3,
                                        }}>{dateFormated}</Text>
                                        <Text style={[MainStyles.ULITWTitle,{color:'#03163a'}]}>{item.msg_text.split(" ").splice(0,4).join(" ")}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                        {
                                            item.unread_count > 0 && 
                                            <View style={[curStyle.IconStyle,{backgroundColor:'#5cc06c'}]}>
                                                <Text style={curStyle.IconTextStyle}>{item.unread_count}</Text>
                                            </View>
                                        }
                                        {
                                            item.unread_count == 0 && 
                                            <View
                                            style={[curStyle.IconStyle,{backgroundColor:'#416bb9'}]}
                                            >
                                                <Icon name="check" style={curStyle.IconTextStyle} />
                                            </View>
                                        }
                                    <TouchableOpacity 
                                    onPress={()=>{
                                        Alert.alert(
                                            'Hide this chat',
                                            'Temporarily hide this chat',
                                            [
                                                {
                                                    text: 'No',
                                                    onPress: () => console.log('Cancel Pressed'),
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: 'Yes',
                                                    onPress: () => {
                                                        this.hideChat(item.chat_id);
                                                    }
                                                }
                                            ],
                                            {cancelable: true},
                                            );
                                    }}
                                    style={[curStyle.IconStyle,{marginLeft:5}]}
                                    >
                                        <Image
                                            source={require("../assets/close-button-large.png")}
                                            style={{ width: 20, height: 20 }}
                                        />
                                        {/* <Text style={curStyle.IconTextStyle}>
                                            <Icon name="times" />
                                        </Text> */}
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            }
                        </View>
                    )}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={()=>{this.setState({isRefreshing:true}),this.refreshList()}}
                            title="Pull to refresh"
                            tintColor="#fff"
                            titleColor="#fff"
                            colors={["#2e4d85","red", "green", "blue"]}
                        />
                    }
                    keyExtractor={(item) => 'key-'+item.chat_id}
                    viewabilityConfig={this.viewabilityConfig}
                    />
                }
            </SafeAreaView>
        );
    }
}
const curStyle = StyleSheet.create({
    UserListItem:{
        paddingHorizontal:15,
        paddingVertical: 10,
        borderBottomColor:'#8da6d4',
        borderBottomWidth:1,
        flexDirection:'row',
    },
    IconStyle:{
        width:20,
        height:20,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
    },
    IconTextStyle:{
        color:'#FFF',
        fontFamily:'Roboto-Medium',
        fontSize:10,
        textAlign:'center',
        textAlignVertical:'center'
    }
});
export default PrivatMsgScreen;