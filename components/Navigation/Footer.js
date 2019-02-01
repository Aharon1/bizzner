import React,{Component} from 'react';
import { View,TouchableOpacity,Text,AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SERVER_URL} from '../../Constants';
export default class Footer extends Component {
    constructor(props){
        super(props);
        this.state={
            pcCount:0
        }
    }
    async setUserId(){
        var userID =  await AsyncStorage.getItem('userID');
        this.setState({userID});
    }
    componentDidMount(){
        this.setUserId();
        setTimeout(()=>{
            this.getPrivatChatCount();
            setInterval(()=>{
                this.getPrivatChatCount();
            },4000);
        },200);
    }
    async getPrivatChatCount(){
        var userID =  await AsyncStorage.getItem('userID');
        await fetch(SERVER_URL+'?action=privatMsgsCount&user_id='+userID)
        .then(res=>res.json())
        .then(response=>{
            this.setState({pcCount:response.pcCount});
            const setInboxLabel = NavigationActions.setParams({
                params: { privateCount: response.pcCount},
                key: 'Messages',
              });
            this.props.navigation.dispatch(setInboxLabel);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render(){
        return (
            <View style={{
                justifyContent:'space-evenly',
                alignItems:'center',
                flexDirection:'row',
                borderTopWidth:1,
                borderTopColor:'#8da6d5',
                paddingTop:5,
                paddingBottom:5
            }}>
                <TouchableOpacity style={{alignItems:'center',width:'50%',
                paddingTop:10,
                paddingBottom:10}} >
                    <View>
                        <Icon name="comments" style={{ fontSize: 28, color: '#8da6d5' }} />
                        <View style={{
                                position:'absolute',
                                right:-13,
                                top:-13,
                                alignItems:'center',
                                alignContent:'center',
                                justifyContent:'center',
                                backgroundColor:'#0846b8',
                                borderRadius:100,
                                width:25,
                                height:25,
                            }}>
                            <Text style={{
                                fontSize:11,
                                color:'#FFFFFF',
                            }}>23</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center',
                borderLeftColor:'#8da6d5',
                borderLeftWidth:1,
                width:'50%'}} >
                    <View>
                        <Icon name="comment" style={{ fontSize: 28, color: '#8da6d5' }} />
                        {
                            this.state.pcCount > 0 &&  
                            <View style={{
                            position:'absolute',
                            right:-13,
                            top:-13,
                            alignItems:'center',
                            alignContent:'center',
                            justifyContent:'center',
                            backgroundColor:'#0846b8',
                            borderRadius:100,
                            width:25,
                            height:25,
                            }}>
                                <Text style={{
                                    fontSize:11,
                                    color:'#FFFFFF',
                                }}>23</Text>
                            </View>
                        }
                        
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    
}