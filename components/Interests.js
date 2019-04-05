import React, {Component} from 'react';
import { View,Text,TouchableOpacity, 
    ScrollView,AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import {SERVER_URL} from '../Constants';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import HardText from '../HardText';
class Interests extends Component{
    constructor(props){
        super(props);
        this.state ={
            loading:true,
            isLoadingTag : false,
            InterestsTags: [],
            selectedITs:[],
        }
        this.loadMoreTags = this._loadMoreTags.bind(this);
    }
    _loadMoreTags = ()=>{
        if(!this.state.isLoadingTag){

        }
    }
    setUserID = async()=>{
        var UserID = await AsyncStorage.getItem('userID');
        this.setState({UserID});
    }
    componentDidMount(){
        this.setUserID()
        fetch(SERVER_URL+'?action=get_tags')
        .then(res=>res.json())
        .then(response=>{
            this.setState({loading:false,InterestsTags:response.body})
        })
        .catch(err=>{
            console.log(err);
        })
    }
    selectTag = (id)=>{
        if(this.state.selectedITs.indexOf(id) === -1){
            var selectedITs = this.state.selectedITs;
            selectedITs.push(id);
            this.setState({selectedITs})
        }
        else{
            var selectedITs = this.state.selectedITs;
            selectedITs.splice(this.state.selectedITs.indexOf(id),1);
            this.setState({selectedITs});
        }
    }
    saveInterests = ()=>{
        this.setState({loading:true});
        fetch(SERVER_URL+'?action=save_interests&user_id='+this.state.UserID+'&interest='+this.state.selectedITs.join(','))
        .then(res=>res.json())
        .then(response=>{
            this.setState({loading:false});
            if(response.code == 200){
                Toast.show(response.message,Toast.SHORT);
                this.props.navigation.navigate('Home');
            }            
        })
        .catch(err=>{console.log(err)})
    }
    render(){
        return(
            <View style={MainStyles.normalContainer}>
                <Loader loading={this.state.loading} />
                <View style={
                    [
                        MainStyles.eventsHeader,
                        {
                            backgroundColor:'#0947b9',
                            alignItems:'center',
                            flexDirection:'row',
                            justifyContent:'space-between',
                            elevation:7
                }]}>
                    <View style={{justifyContent:'flex-start'}}>
                        <Text style={{fontSize:16,color:'#FFF',marginLeft:18,fontFamily:'Roboto-Medium',textAlign:'left'}}>{HardText.skip_fill_later}</Text>
                    </View>
                    <View style={{justifyContent:'flex-end',paddingRight:20}}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Home')}}>
                            <Icon name="chevron-right" size={18} style={{color:'#FFF'}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                    <Text style={{fontSize:16,color:'#8da6d5',marginLeft:18}}>{HardText.select_your_interests}</Text>
                </View>
                <View style={{
                    justifyContent:'center',
                    alignItems:'center',
                    marginTop:30
                }}>
                    <Text style={{color:'#03163a',fontFamily:'Roboto-Light',fontSize:16,maxWidth:180,textAlign:'center'}}>{HardText.choose_tags}</Text>
                </View>
                <ScrollView style={MainStyles.tagsContent} contentContainerStyle={{
                    justifyContent:"center",
                    alignItems:'center',
                }}>
                    <View style={{maxWidth:320,flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'center'}}>
                        {
                            this.state.InterestsTags.map(( item, key ) =>
                            (
                                <TouchableOpacity key = { key } style={[
                                    MainStyles.InterestsTags,
                                    (this.state.selectedITs.indexOf(item.id) !== -1)?{backgroundColor:'#0846b8'}:''
                                ]} onPress={()=>{this.selectTag(item.id)}}>
                                    <Text style={[
                                        MainStyles.ITText,
                                        (this.state.selectedITs.indexOf(item.id) !== -1)?{color:'#FFF'}:''
                                    ]}>{item.tag_name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    <TouchableOpacity style={{
                        backgroundColor:'#3a6cc7',
                        padding:15,
                        marginTop:15,
                        borderRadius:50,
                    }} onPress={this.loadMoreTags}>
                        <Icon name="chevron-down" style={{color:'#FFF'}} size={15}/>
                    </TouchableOpacity>
                    <View style={{
                        marginTop:30
                    }}>
                        <TouchableOpacity style={{
                            paddingVertical:10,
                            paddingHorizontal:20,
                            backgroundColor:'#0947b9',
                            borderRadius:50
                        }}
                        onPress={()=>{
                            this.saveInterests()
                        }}
                        >
                            <Text style={{
                                fontSize:18,
                                color:'#FFF',
                                fontFamily:'Roboto-Regular'
                            }}>{HardText.save}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
export default Interests;