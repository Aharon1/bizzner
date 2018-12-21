import React,{Component} from 'react';
import {View,TextInput,ScrollView,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationItem from './LocationItem';
import MainStyles from '../StyleSheet';
import _ from 'lodash';
export default class PlacesAutocomplete extends Component{
    constructor(props) {
        super(props);
        this.state = {
            textingValue:false,
            isLoading:false,
            locationItems:{}
        }
        this.hTC = this.handleTextChange.bind(this);
        this.onChangeTextDelayed = _.debounce(this.hTC, 200);
      }
    handleTextChange(text){
        if(text.length > 2){
            this.setState({isLoading:true,textingValue:true})
            navigator.geolocation.getCurrentPosition(positions=>{
                let Latitude = positions.coords.latitude;//;32.079394
                let Longitude = positions.coords.longitude;//;34.8438209
                fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+Latitude+","+Longitude+"&type=cafe&keyword="+text+"&rankby=distance&key=AIzaSyCJRgtLQrTsiDSPvz0hzKlEXisjf2UsBbM")
                .then(res=>{
                    var bodyText = JSON.parse(res._bodyText);
                    console.log(bodyText);
                    this.setState({locationItems:bodyText.results})
                    this.setState({isLoading:false})
                })
            })
        }
        else{
            this.setState({textingValue:false})
        }
    }
    render (){
        return (
            <View style={{zIndex:40}}>
<<<<<<< HEAD
                <View style={[MainStyles.createEventFWI,{marginBottom:0}]}>
=======
                <View style={[MainStyles.createEventFWI,{marginTop:30}]}>
>>>>>>> MustafaCode
                    <Icon name="search" style={MainStyles.cEFWIIcon}/>
                    <TextInput style={MainStyles.cEFWITF} 
                        placeholder="Search Location" 
                        placeholderTextColor="#03163a" 
                        underlineColorAndroid="transparent"
                        onChangeText={this.onChangeTextDelayed}
                    />
                </View>
                {
                    this.state.textingValue &&  
                    <ScrollView style={MainStyles.locationItemWrapper}>
                        {this.state.isLoading && <ActivityIndicator size="large" color="#416bb9"/>}
                        {
                            this.state.locationItems.length > 0 && 
                            this.state.locationItems.map((el, i) => (
                                <LocationItem
                                    {...el}
                                    key={String(i)}
                                    fecthDetails={this.props.fetchDetails}
                                />
                            ))
                        }
                    </ScrollView> 
                }
            </View>
            
        )
    }
}