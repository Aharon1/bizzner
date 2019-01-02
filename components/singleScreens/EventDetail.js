import React,{Component} from 'react';
import { View,Text,TouchableOpacity,FlatList,ToastAndroid} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { HeaderButton } from '../Navigation/HeaderButton';
import MainStyles from '../StyleSheet';
import {SERVER_URL} from '../../Constants';
import Loader from '../Loader';
import ProgressiveImage from '../../components/AsyncModules/ImageComponent';
export default class EventDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            event_id:this.props.navigation.getParam('event_id'),
            userList:{},
            curStatus:'',
            eventData:''
        }
        //this.getEventUsers();
    }
    componentDidMount(){
        this.fetchNewDetails();
    }
    componentDidUpdate(prevProps,prevState,snapshot){
        var paramEventId = this.props.navigation.getParam('event_id');
        var prevEventId = prevProps.navigation.getParam('event_id')
        if(paramEventId != prevState.event_id){
            this.setState({loading:true,userList:{},eventData:'',curStatus:'',event_id:paramEventId});
            this.fetchNewDetails()
        }
    }
    /*componentWillReceiveProps(){
        var paramEventId = this.props.navigation.getParam('event_id');
        //console.log(this.state.event_id,paramEventId);
        console.log('New=>'+paramEventId,'Previuos=>'+this.state.event_id);
        if(this.state.event_id != paramEventId){
            this.setState({loading:true,userList:{},eventData:'',curStatus:'',event_id:paramEventId});
            this.fetchNewDetails()
        }
    }*/
    fetchNewDetails(){
        var user_id = 29;
        var eventId = this.state.event_id;
        fetch(SERVER_URL+'?action=getEventUsers&event_id='+eventId+'&user_id='+user_id)
        .then(response=>response.json())
        .then(res=>{
            this.setState({loading:false,userList:res.users,eventData:res.event_data,curStatus:res.curStatus});
        })
    }
    setUserEventStatus =  async (statusValue)=>{
        var curItem = this.state.eventData;
        var user_id = 29;
        fetch(SERVER_URL+'?action=changeUserEventStatus&user_id='+user_id+'&event_id='+curItem.group_id+'&status='+statusValue)
        .then(response=>{
            curStatus = statusValue;
            this.setState({curStatus:statusValue});
            if(statusValue == 1){
                ToastAndroid.showWithGravity('You are interested to this event',ToastAndroid.SHORT,ToastAndroid.CENTER);
            }
            else if(statusValue == 2){
                ToastAndroid.showWithGravity('You are joined to this event',ToastAndroid.SHORT,ToastAndroid.BOTTOM);
            }
            else if(statusValue ==3){
                ToastAndroid.showWithGravity('You have ignored this event',ToastAndroid.SHORT,ToastAndroid.CENTER);
            }
        })
    }
    render(){
        return(
            <View style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:20}}>EVENT DETAILS</Text>
                </View>
                <View style={[MainStyles.tabContainer,{elevation:0,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,MainStyles.tabItemActive]} onPress={()=>this.props.navigation.navigate('EventDetail',{event_id:this.state.event_id})}>
                        <Icon name="user-plus" style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveIcon,{fontSize:14}]}/>
                        <Text style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveText,{fontSize:14}]}>Invited to event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                        ]}>
                        <Icon name="share-alt" style={[MainStyles.tabItemIcon,{fontSize:14}]}/>
                        <Text style={[MainStyles.tabItemIcon,{fontSize:14}]}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.tabItem} onPress={()=>this.props.navigation.navigate('Event Chat',{event_id:this.state.event_id,note:this.state.eventData.event_note})}>
                        <Icon name="comments" style={[MainStyles.tabItemIcon,{fontSize:14}]}/>
                        <Text style={[MainStyles.tabItemIcon,{fontSize:14}]}>Event chat</Text>
                    </TouchableOpacity>
                </View>
                <View style={[MainStyles.EventScreenTabWrapper,{backgroundColor:'#d1dbed'}]}>
                    <TouchableOpacity style={[
                    MainStyles.EIAButtons,
                    (this.state.curStatus == 2)?{backgroundColor:'#87d292'}:''
                    ]}
                    onPress={()=>this.setUserEventStatus(2)}
                    >
                        <Icon name="check" size={15} style={{color:'#FFF',marginRight:5,}}/>
                        <Text style={{
                            color:'#FFF',
                            fontFamily:'Roboto-Medium',
                            fontSize:14
                        }}>Join</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                    MainStyles.EIAButtons,{marginHorizontal:5},
                    (this.state.curStatus == 1)?{backgroundColor:'#8da6d5'}:''
                    ]}
                        onPress={()=>this.setUserEventStatus(1)}
                    >
                        <Icon name="star" size={15} style={{color:'#FFF',marginRight:5,}}/>
                        <Text style={{
                            color:'#FFF',
                            fontFamily:'Roboto-Medium',
                            fontSize:14
                        }}>Interested</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                    MainStyles.EIAButtons,
                    (this.state.curStatus == 0)?{backgroundColor:'#d28787'}:''
                    ]}
                        onPress={()=>this.setUserEventStatus(3)}
                        >
                        <Icon name="ban" size={15} style={{color:'#FFF',marginRight:5,}}/>
                        <Text style={{
                            color:'#FFF',
                            fontFamily:'Roboto-Medium',
                            fontSize:14
                        }}>Ignore</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state && this.state.eventData !='' && 
                    <View style={MainStyles.eventDataHeader}>
                        <View style={{width:40,height:40,marginRight:10}}>
                            <ProgressiveImage source={{uri:this.state.eventData.photoUrl}} style={{width:40,height:40}}/>
                        </View>
                        <View style={{justifyContent:'flex-start',paddingRight:10,flexDirection:'column'}}>
                            <Text style={{color:'#03163a',fontFamily:'Roboto-Regular',fontSize:12,flexWrap: 'wrap'}}>
                                {this.state.eventData.group_name}, 
                                <Text  style={{fontFamily:'Roboto-Light',fontSize:11,flexWrap: 'wrap'}}> {this.state.eventData.group_address.split(" ").splice(0,5).join(" ")}</Text>
                            </Text>
                            <Text style={{color:'#39b54a',fontFamily:'Roboto-Medium',fontSize:11,flexWrap: 'wrap'}}>{this.state.eventData.event_subject}</Text>
                            <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:11,flexWrap: 'wrap'}}>Note: {this.state.eventData.event_note}</Text>
                        </View>
                    </View>
                }
                
                {
                    this.state && this.state.userList && this.state.userList.length > 0 && 
                    <FlatList 
                        data={this.state.userList}
                        renderItem={({item}) => (
                            <View style={[MainStyles.UserListItem,
                                (item.status == "1")?{backgroundColor:'#d1dbed'}:''
                            ]}>
                                <View style={MainStyles.userListItemImageWrapper}>
                                    <ProgressiveImage source={{uri:item.picUrl}} style={MainStyles.userListItemIWImage} resizeMode="cover"/>
                                </View>
                                <View style={MainStyles.userListItemTextWrapper}>
                                    <Text style={MainStyles.ULITWName}>{item.name}</Text>
                                    <Text style={MainStyles.ULITWTitle}>{item.title}</Text>
                                    {
                                        item.status=="1"
                                        && 
                                        <View style={[MainStyles.ULITWAction,{backgroundColor:'#8da6d5'}]}>
                                            <Icon name="star" style={MainStyles.ULITWActionIcon}/> 
                                            <Text style={MainStyles.ULITWActionText}>INTRESTED</Text>
                                        </View>
                                    }
                                    {
                                        item.status=="2"
                                        && 
                                        <View style={MainStyles.ULITWAction}>
                                            <Icon name="check" style={MainStyles.ULITWActionIcon}/> 
                                            <Text style={MainStyles.ULITWActionText}>ACCEPTED</Text>
                                        </View>
                                    }
                                </View>
                                <TouchableOpacity style={MainStyles.ChatIconWrapper} onPress={()=>{alert('Alerting')}}>
                                    <Icon name="comments"style={MainStyles.ChatIcon}/>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item) => item.key}
                    />
                }
                
            </View>
        );
    }
}