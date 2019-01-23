import React, { Component } from 'react';
import { View,Text,TouchableOpacity, 
    Platform,FlatList,AsyncStorage,
    RefreshControl,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Loader from './Loader';
import { HeaderButton } from './Navigation/HeaderButton';
import {SERVER_URL} from '../Constants';
import ProgressiveImage from './AsyncModules/ImageComponent';
class PrivatMsgScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            chatList:{},
            isRefreshing:false
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
        this.setUserId();
        setTimeout(()=>{this.fetchList();},200)
    }
    _fetchList= async ()=>{
        await fetch(SERVER_URL+'?action=getPrivateList&user_id='+this.state.userID)
        .then(res=>res.json())
        .then(response=>{
            if(response.code != 404){
                this.setState({chatList:response.body.results});
                console.log(this.state.chatList);
            }
            this.setState({loading:false,isRefreshing:false})
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
    render(){
        return(
            <View style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:18}}>CHAT LIST</Text>
                </View>
                {
                    this.state && this.state.chatList && this.state.chatList.length > 0 && 
                    <FlatList 
                        data={this.state.chatList} 
                        renderItem={({item})=>(
                            <TouchableOpacity style={[MainStyles.UserListItem,{backgroundColor:'#d1dbed'}]}>
                                <View style={{overflow:'hidden',width:70,height:70}}>
                                    <ProgressiveImage source={{uri:item.user_pic}} style={{
                                        width: 70, 
                                        height: 70,
                                        borderRadius:100,
                                        borderWidth: 3,
                                        borderColor: '#FFF'
                                    }} resizeMode="cover"/>
                                </View>
                                <View style={MainStyles.userListItemTextWrapper}>
                                    <Text style={[MainStyles.ULITWName,{fontFamily:'Roboto-Meduim',color:'#03163a'}]}>{item.name}</Text>
                                    <Text style={[MainStyles.ULITWTitle,{color:'#416bb9'}]}>{item.msg_text.split(" ").splice(0,2).join(" ")}</Text>
                                </View>
                                <View style={[MainStyles.ChatIconWrapper,{flexDirection:'row'}]}>
                                    <Text 
                                    style={{
                                        color:'#416bb9',
                                        fontFamily:'Roboto-Regular',
                                        fontSize:12,
                                        marginRight:7
                                    }}>{this.formatAMPM(item.timestamp)}</Text>
                                    {
                                        
                                    }
                                    <Text style={{
                                        color:'#FFF',
                                        fontFamily:'Roboto-Medium',
                                        fontSize:12,
                                        backgroundColor:'#5cc06c',
                                        width:30,
                                        height:30,
                                        textAlign:'center',
                                        textAlignVertical:'center',
                                        borderRadius:100
                                    }}>23</Text>
                                    <Text style={{
                                        color:'#FFF',
                                        fontFamily:'Roboto-Medium',
                                        fontSize:12,
                                        backgroundColor:'#c4d1e9',
                                        width:30,
                                        height:30,
                                        textAlign:'center',
                                        textAlignVertical:'center',
                                        borderRadius:100
                                    }}>
                                        <Icon name="check" />
                                    </Text>
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
                
            </View>
        );
    }
}
export default PrivatMsgScreen;