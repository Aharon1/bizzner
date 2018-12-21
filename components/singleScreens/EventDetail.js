import React,{Component} from 'react';
import { View,Text,TouchableOpacity,FlatList,Image} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { HeaderButton } from '../Navigation/HeaderButton';
import MainStyles from '../StyleSheet';
import {SERVER_URL} from '../../Constants';
import Loader from '../Loader';
export default class EventDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            userList:[{
                name:'',
                picUrl:'',
                title:'',
                status:'',
                userId:1
            },
            {
                name:'',
                picUrl:'',
                title:'',
                status:'',
                userId:2
            }]
        }
        this.getEventUsers();
    }
    static navigationOptions = {
        drawerLabel: 'Event Details',
      };
    getEventUsers(){

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
                        MainStyles.tabItem,MainStyles.tabItemActive]} onPress={()=>this.props.navigation.navigate('EventDetail')}>
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
                    <TouchableOpacity style={MainStyles.tabItem} onPress={()=>this.setState({CreateEventVisible:true})}>
                        <Icon name="comments" style={MainStyles.tabItemIcon}/>
                        <Text style={MainStyles.tabItemIcon}>EVENT CHAT</Text>
                    </TouchableOpacity>
                </View>
                <FlatList 
                     data={this.state.userList}
                     renderItem={({item}) => (
                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{flex:2}}>
                                <Image source={require('../../assets/profile-pic.png')} width={60} height={60}/>
                            </View>
                            <View>
                                <Text>Name</Text>
                                <View>
                                    <Icon name="check"/> 
                                    <Text>Accepted</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <Icon name="comments"/>
                            </TouchableOpacity>
                        </View>
                    )}
                     keyExtractor={(item) => item.userId}
                />
            </View>
        );
    }
}