import React, { Component } from 'react';
import { View,Text} from 'react-native';
export default class Header extends Component{
    render(){
        return (
            <View style={[MainStyles.eventsHeader,{alignItems:'center',flexDirection:'row'}]}>
                <TouchableOpacity style={{paddingLeft:12}}>
                    <Icon name="bars" style={{fontSize:24,color:'#8da6d5'}}/>
                </TouchableOpacity>
                <Text style={{fontSize:20,color:'#8da6d5',marginLeft:20}}>Events near me</Text>
            </View>
        )   
    }
}