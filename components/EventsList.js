import React, { Component } from 'react';
import {FlatList,ActivityIndicator,View} from 'react-native';
import ListItem from './ListItem';
class EventsList extends Component{
    constructor(props){
        super(props);
        this.fetchMore = this._fetchMore.bind(this);
        this.state = {
            data:this.props.locationList,
            loading:false,
            isLoading: true,
            isLoadingMore: false,
            _data: null,
            _dataAfter: ""
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
    _fetchMore() {
        /*this.fetchData(responseJson => {
            const data = this.state._data.concat(responseJson.data.children);
            this.setState({
            isLoadingMore: false,
            _data: data,
            _dataAfter: responseJson.data.after
            });
        });*/
        this.setState({
            isLoadingMore: false,
        });
    }
    render(){
        //let PushArray = [];
        //this.fecthDetails(PushArray);
        //console.log('Response',this.state.data);
        return (
            <FlatList data={this.state.data}
                renderItem={({item}) => (
                    <ListItem item={item} fetchDetails={this.props.fetchDetails}/>
                    )}
                onEndReached={()=>{this.setState({ isLoadingMore: true }, () => this.fetchMore())}
                }
                keyExtractor={(item) => item.key}
                ListFooterComponent={() => { // replaces renderFooter={() => {
                    return (
                    this.state.isLoadingMore &&
                    <View style={{ flex: 1, padding: 10 }}>
                        <ActivityIndicator size="large" />
                    </View>
                    );
                }}
            />
        );
    }
}
export default EventsList;