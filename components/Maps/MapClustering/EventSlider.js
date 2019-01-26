import React, { Component } from 'react';
import {View,Text} from 'react-native';
import SERVER_URL from '../../../Constants';
import { StyleSheet } from 'react-native';
class EventSlider extends Component{
    componentDidMount(){
        LG = this.props.location;
        limit = this.props.limit;
        closeSlider = this.props.closeSlider;
        console.log(this.props,LG,limit,closeSlider);
        /*fetch(SERVER_URL+'?action=getClusterEvents&latitude='+LG.coordinates[0]+'&longitude='+LG.coordinates[1]+'&limit='+limit)
        //.then(res=>res.json())
        .then(response=>{
            console.log(response);
        })
        .catch(err=>{
            console.log(err);
        })*/
    }
    render(){
        return (
            
        );
    }
}
const CurrentStyles = StyleSheet.create({
    sliderWrapper:{
        flex:1,
        flexDirection:'row'
    }
})
export default EventSlider;