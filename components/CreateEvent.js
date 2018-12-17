import React, { Component } from 'react';
import { View,Text,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Dialog, { DialogContent,SlideAnimation } from 'react-native-popup-dialog';
class CreateEvent extends Component{
    constructor(props){
        super(props)
        this.state = {
            CreateEventVisible:false
        }
    }
    render(){
        return (
            <View style={MainStyles.normalContainer}>
                
            </View>
        );
    }
}
export default CreateEvent;