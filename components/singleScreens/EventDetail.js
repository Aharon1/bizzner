import React,{Component} from 'react';
import { View,Text,TouchableOpacity,FlatList} from 'react-native';
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
            userList:{}
        }
        this.getEventUsers();
    }
    getEventUsers(){
        var eventId = this.props.navigation.getParam('event_id');
        fetch(SERVER_URL+'?action=getEventUsers&event_id='+eventId)
        .then(response=>response.json())
        .then(res=>{
            console.log(res);
            this.setState({loading:false,userList:res.users,eventData:res.event_data});
        })
    }
    render(){
        return(
            <View style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <HeaderButton onPress={() => {this.props.navigation.dispatch(DrawerActions.toggleDrawer())} } />
                    <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>EVENT DETAILS</Text>
                </View>
                <View style={[MainStyles.tabContainer,{justifyContent:'space-between',alignItems:'center',flexDirection:'row'}]}>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,MainStyles.tabItemActive]} onPress={()=>this.props.navigation.navigate('EventDetail',{event_id:this.state.event_id})}>
                        <Icon name="user-plus" style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveIcon]}/>
                        <Text style={[MainStyles.tabItemIcon,MainStyles.tabItemActiveText]}>INVITED TO EVENT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        MainStyles.tabItem,
                        (this.state.TabComponent == 'map') ? MainStyles.tabItemActive : null
                        ]}>
                        <Icon name="share-alt" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemIcon}>SHARE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MainStyles.tabItem}>
                        <Icon name="comments" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemIcon}>EVENT CHAT</Text>
                    </TouchableOpacity>
                </View>
                <View style={MainStyles.EventScreenTabWrapper}>
                <TouchableOpacity style={[
                        MainStyles.EIAButtons,
                        (this.state.userStatus == 2)?{backgroundColor:'#87d292'}:''
                        ]}
                        onPress={()=>this.setUserEventStatus(2)}
                        >
                            <Icon name="check" size={15} style={{color:'#FFF',marginRight:5,}}/>
                            <Text style={{
                                color:'#FFF',
                                fontFamily:'Roboto-Medium',
                                fontSize:14
                            }}>JOIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons,{marginHorizontal:5},
                        (this.state.userStatus == 1)?{backgroundColor:'#8da6d5'}:''
                        ]}
                            onPress={()=>this.setUserEventStatus(1)}
                        >
                            <Icon name="star" size={15} style={{color:'#FFF',marginRight:5,}}/>
                            <Text style={{
                                color:'#FFF',
                                fontFamily:'Roboto-Medium',
                                fontSize:14
                            }}>INTERESTED</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                        MainStyles.EIAButtons       
                        ]}
                            onPress={()=>this.setUserEventStatus(3)}
                            >
                            <Icon name="ban" size={15} style={{color:'#FFF',marginRight:5,}}/>
                            <Text style={{
                                color:'#FFF',
                                fontFamily:'Roboto-Medium',
                                fontSize:14
                            }}>IGNORE</Text>
                        </TouchableOpacity>
                </View>
                {
                    this.state.userList.length > 0 && 
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