import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { MarkerItem } from "./MarkerItem";
import { MapClustering } from './MapClustering';
import ProgressiveImage from '../AsyncModules/ImageComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
const dummyImage = require('../../assets/dummy.jpg');

export default class GoogleMapView extends PureComponent {
    state = {
        isModalOpen: false,
        modalName: '',
        subject: ''
    }
    render() {
        const { isModalOpen, eventData } = this.state;
        return (
            <View style={styles.container}>
                <MapClustering
                    onPress={this.onCloseModal}
                    style={styles.map}
                    region={this.props.currentPosition}>
                    {this.props.events.map((marker, id) => (<MarkerItem {...marker}
                        key={id} onOpenModal={this.onOpenModal} cluster={true}
                        onNavigate={this.props.onNavigate} />))
                    }
                </MapClustering>
                {
                    isModalOpen &&
                    <View style={{width:'85%',paddingBottom:20,borderTopLeftRadius:10,borderTopRightRadius:10,backgroundColor:'#FFF',elevation:5}}>
                        <View style={{width:'100%',height:150}}>
                            <ProgressiveImage source={{uri:eventData.event_photo}} style={{width:'100%',height:150,borderTopLeftRadius:10,borderTopRightRadius:10}} />
                        </View>
                        <View style={{
                            paddingHorizontal:15,
                            paddingVertical:10,
                        }}>
                            <Text style={{
                                fontFamily:'Roboto-Medium',
                                color:'#05296d',
                                fontSize:16
                            }}>
                                {eventData.event_subject}
                            </Text>
                            <Text style={{
                                fontFamily:'Roboto-Regular',
                                color:'#05296d',
                                fontSize:14
                            }}>
                                {eventData.group_name}, 
                                <Text  style={{
                                fontFamily:'Roboto-Light',
                                color:'#05296d',
                                fontSize:13
                            }}> {eventData.group_address}</Text>
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
                                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                    <Icon name="clock-o" style={{marginRight:5,color:'#8da6d5'}} size={14}/>
                                    <Text  style={{fontFamily:'Roboto-Regular',fontSize:14,color:'#8da6d5'}}>
                                        {this.formatDate(new Date(eventData.event_date+' '+eventData.event_time))} - {this.formatAMPM(new Date(eventData.event_date+' '+eventData.event_time))}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={this.goToEvent} style={{borderRadius:20,paddingVertical:5,paddingHorizontal:15,backgroundColor:'#416bb9'}}>
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',fontSize:13}}>INFO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </View>
        );
    }

    onOpenModal = (eventData) => {
        this.setState({
            isModalOpen: true,
            eventData
        })
    }
    goToEvent = ()=>{
        this.props.onNavigate({event_id:this.state.eventData.event_id});
        this.setState({
            isModalOpen: false,
            eventData:''
        })
    }
    onCloseModal = () => {
        this.setState({
            isModalOpen: false,
            eventData:''
        })
    }
    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    formatDate(date){
        return date.getDate()+' '+(date.getMonth()+1)+' '+date.getFullYear();
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    textStyle: {
        fontSize: 20,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        padding: 5,
        color: '#000'
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10
    },
});