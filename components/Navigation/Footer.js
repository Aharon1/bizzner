import React,{Component} from 'react';
import { View,TouchableOpacity,Text,AsyncStorage } from 'react-native';
import { NavigationActions,withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SERVER_URL} from '../../Constants';
class Footer extends Component {
    _isMounted = false;
    clearTime = '';
    constructor(props){
        super(props);
        this.state={
            pcCount:0,
            ecCount:0
        }
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount(){
        this._isMounted = true;
        this.setUserId();
        setTimeout(()=>{
            this.getPrivatChatCount();
            this.clearTime = setInterval(()=>{
                this.getPrivatChatCount();
            },4000);
        },200);
    }
    async getPrivatChatCount(){
        var userID =  await AsyncStorage.getItem('userID');
        await fetch(SERVER_URL+'?action=privatMsgsCount&user_id='+userID)
        .then(res=>res.json())
        .then(response=>{
            if (this._isMounted) {
                this.setState({pcCount:response.pcCount,ecCount:response.ecCount});
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    componentWillUnmount(){
        this._isMounted = false;
        clearTimeout(this.clearTime);
    }
    render(){
        return (
            <View style={{
                justifyContent:'space-between',
                alignItems:'center',
                flexDirection:'row',
                borderTopWidth:1,
                borderTopColor:'#8da6d5',
                paddingTop:5,
                paddingBottom:5
            }}>
                <TouchableOpacity style={{alignItems:'center',width:'33%',
                paddingTop:5,
                paddingBottom:5}} onPress={()=>this.props.navigation.navigate('EventChatList')}>
                    <View>
                        <Icon name="comments" style={{ fontSize: 27, color: '#8da6d5' }} />
                        { 
                            this.state.ecCount > 0 && 
                            <View style={{
                                position:'absolute',
                                right:-12,
                                top:-8,
                                alignItems:'center',
                                alignContent:'center',
                                justifyContent:'center',
                                backgroundColor:'#e74c3c',
                                borderRadius:100,
                                width:20,
                                height:20,
                            }}>
                            <Text style={{
                                 fontSize:12,
                                 fontFamily:'Roboto-Medium',
                                 color:'#FFFFFF',
                            }}>{this.state.ecCount}</Text>
                        </View> }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center',
                borderLeftColor:'#8da6d5',
                borderLeftWidth:1,
                width:'33%'}}  onPress={()=>this.props.navigation.navigate('Messages')} >
                    <View>
                        <Icon name="comment" style={{ fontSize: 27, color: '#8da6d5' }} />
                        {
                            this.state.pcCount > 0 &&  
                            <View style={{
                                position:'absolute',
                                right:-12,
                                top:-8,
                                alignItems:'center',
                                alignContent:'center',
                                justifyContent:'center',
                                backgroundColor:'#e74c3c',
                                borderRadius:100,
                                width:20,
                                height:20,
                            }}>
                                <Text style={{
                                    fontSize:12,
                                    fontFamily:'Roboto-Medium',
                                    color:'#FFFFFF',
                                }}>{this.state.pcCount}</Text>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center',
                borderLeftColor:'#8da6d5',
                borderLeftWidth:1,
                width:'33%'}} onPress={()=>{this.props.showSearch()}}>
                    <Icon name="search"  style={{ fontSize: 27, color: '#8da6d5' }}/>
                </TouchableOpacity>
            </View>
        )
    }
}
export default  withNavigation(Footer)