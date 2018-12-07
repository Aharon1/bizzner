import React, { Component } from 'react';
import { View,Text,FlatList,ScrollView,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MainStyles from './StyleSheet';
import Loader from './Loader';
import ListItem from './ListItem';
class EventsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:this.props.locationList,
            loading:false

        }
    }
    fecthDetails = ()=>{
        let Latitude = this.props.coords.latitude;
        let Longitude = this.props.coords.longitude;
        //let urlToFetch = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+Latitude+','+Longitude+'&radius=1500&key=AIzaSyBSXKgQnJWjgEJDru0DFiG188-Nc_ry6w8&types=restaurant,cafe';
        // var fetchData = 'http://dissdemo.biz/bizzler?action=search_location_db&latitude='+Latitude+'&longitude='+Longitude;
        // fetch(fetchData,{
        //     method:'POST',
        //     body:JSON.stringify({
        //         action:'search_location_db',
        //         latitude:Latitude,//22.7150822,
        //         longitude:Longitude//75.8707448
        //     })
        // })
        // .then(response=>{
        //     var bodyText = JSON.parse(response._bodyText);
        //     //console.log('Response',bodyText);
        //     const placesArray = [];
        //     for (const bodyKey in bodyText){
        //         placesArray.push({
        //             name:bodyText[bodyKey].group_name,
        //             address:bodyText[bodyKey].group_address,
        //             isStarted:bodyText[bodyKey].group_status,
        //             key:bodyKey
        //         });
        //     }
        //     PushArray = placesArray;
        //     //this.setState({data:placesArray});
        //     console.log('Response',PushArray);
        // }).catch(err => {
        //     console.log('Error What is this',err);
        // })
    }
    
    render(){
        //let PushArray = [];
        //this.fecthDetails(PushArray);
        //console.log('Response',this.state.data);
        return (
            <ScrollView>
                <Loader loading={this.state.loading} />
                <FlatList data={this.state.data}
                    renderItem={({item}) => (
                        <ListItem item={item} />
                      )}
                />
            </ScrollView>
        );
    }
}
export default EventsList;