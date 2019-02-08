import React, { Component } from 'react';
import { View,Text,TouchableOpacity, TextInput, 
    Platform,FlatList,ActivityIndicator,AsyncStorage,
    RefreshControl,SafeAreaView
} from 'react-native';
import {SERVER_URL} from '../../Constants';
import MainStyles from '../StyleSheet';
import Loader from '../Loader';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressiveImage from '../AsyncModules/ImageComponent';
class EventChatListScreen extends Component{
    _isMounted = false;
    clearTime = '';
    constructor(props){
        super(props);
        this.state={
            loading:true,
            isRefreshing:false,
            chatList:{}
        }
        this.viewabilityConfig = {
            waitForInteraction: true,
            viewAreaCoveragePercentThreshold: 95
        }
        this.fetchList = this._fetchList.bind(this);
        this.refreshList = this._refreshList.bind(this);
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
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
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
    _fetchList= async ()=>{ 
        await fetch(SERVER_URL+'?action=EventMsgsList&user_id='+this.state.userID)
        .then(res=>res.json())
        .then(response=>{
            if (this._isMounted) {
                if(response.code == 200){
                    this.setState({chatList:response.body.results});
                }
                this.setState({loading:false,isRefreshing:false});
                console.log(this.state.chatList.length);
            }
        })
        .catch()
    }
    render(){
        return(
            <SafeAreaView style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{justifyContent:'center'}]}>
                    <TouchableOpacity style={{ alignItems:'center',paddingLeft: 12,flexDirection:'row' }} onPress={() => this.props.navigation.goBack() }>
                        <Icon name="chevron-left" style={{ fontSize: 24, color: '#8da6d5' }} />
                        <Text style={{fontSize:16,color:'#8da6d5',marginLeft:20}}>EVENTS CHAT LIST</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.chatList.length > 0 && 
                    <FlatList 
                    contentContainerStyle={{
                        flex:1
                    }}
                    data={this.state.chatList} 
                    renderItem={({item})=>(
                            <TouchableOpacity style={[MainStyles.UserListItem,{backgroundColor:'#d1dbed'}]} onPress={()=>{this.props.navigation.navigate('Event Chat',{event_id:item.chat_id})}}>
                                <View style={{overflow:'hidden',width:80,height:80,borderWidth: 3,
                                        borderColor: '#FFF'}}>
                                    <ProgressiveImage source={{uri:item.event_pic}} style={{
                                        width: 80, 
                                        height: 80,
                                        
                                    }} resizeMode="cover"/>
                                </View>
                                <View style={MainStyles.userListItemTextWrapper}>
                                    <Text style={[MainStyles.ULITWName,{fontFamily:'Roboto-Medium',color:'#03163a'}]}>{item.event_name}</Text>
                                    <Text style={[MainStyles.ULITWTitle,{color:'#416bb9'}]}>{item.msg_text.split(" ").splice(0,4).join(" ")}</Text>
                                </View>
                                <View style={[MainStyles.ChatIconWrapper,{flexDirection:'row'}]}>
                                    <Text 
                                    style={{
                                        color:'#416bb9',
                                        fontFamily:'Roboto-Regular',
                                        fontSize:12,
                                        marginRight:7
                                    }}>{this.formatAMPM(item.send_on)}</Text>
                                    {
                                        item.unread_count > 0 && 
                                        <View
                                        style={{
                                            width:30,
                                            height:30,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderRadius:100,
                                            backgroundColor:'#5cc06c',
                                        }}
                                        ><Text style={{
                                            color:'#FFF',
                                            fontFamily:'Roboto-Medium',
                                            fontSize:12,
                                            
                                            
                                            textAlign:'center',
                                            textAlignVertical:'center',
                                            
                                        }}>{item.unread_count}</Text></View>
                                    }
                                    {
                                        item.unread_count == 0 && 
                                        <View
                                        style={{
                                            width:30,
                                            height:30,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderRadius:100,
                                            backgroundColor:'#c4d1e9',
                                        }}
                                        ><Text style={{
                                            color:'#FFF',
                                            fontFamily:'Roboto-Medium',
                                            fontSize:12,
                                            textAlign:'center',
                                            textAlignVertical:'center',
                                        }}>
                                            <Icon name="check" />
                                        </Text></View>
                                    }
                                </View>
                            </TouchableOpacity>
                        )}
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
                {
                    this.state.chatList.length == 0 &&
                    <Text>No Data Found</Text>
                }
            </SafeAreaView>
        );
    }
}
export default EventChatListScreen;