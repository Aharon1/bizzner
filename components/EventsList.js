import React, { Component } from 'react';
import {FlatList,ActivityIndicator,View,ToastAndroid} from 'react-native';
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
            _dataAfter: "",
            npt:'',
            resultsLost:false
        }
    }
    /*fecthDetails = ()=>{
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
    }*/
    _fetchMore() {
        let npt = (this.state.npt == '' && this.state.resultsLost==false)?this.props.npt:this.state.npt;
        var fetchData = 'http://bizzner.com/app?action=loadMoreLocations&npt='+npt;
        fetch(fetchData,{
            method:'POST',
        })
        .then(response=>{
            var count = this.state.data.length
            var bodyText = JSON.parse(response._bodyText);
            var results = bodyText.results
            console.log(bodyText);
            const placesArray = [];
            for (const bodyKey in results){
                placesArray.push({
                  name:results[bodyKey].group_name,
                  address:results[bodyKey].group_address,
                  isStarted:results[bodyKey].group_status,
                  photoUrl:results[bodyKey].photoUrl,
                  key:'key-'+(count+bodyKey),
                  place_id:results[bodyKey].place_id,
                  latitude:results[bodyKey].latitude,
                  longitude:results[bodyKey].longitude
                });
            }
            
            if(bodyText.next_page_token == ''){
                this.setState({resultsLost:true});
            }
            this.setState({ isLoadingMore: false,npt:bodyText.next_page_token,data:this.state.data.concat(placesArray) });
        }).catch(err => {
            console.log('Error What is this',err);
        })
        /*this.fetchData(responseJson => {
            const data = this.state._data.concat(responseJson.data.children);
            this.setState({
            isLoadingMore: false,
            _data: data,
            _dataAfter: responseJson.data.after
            });
        });*/
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
                onEndReached={()=>{
                        //if(this.state.isLoadingMore == false && this.state.resultsLost == false){
                            this.setState({ isLoadingMore: true }, () => this.fetchMore())
                        /*}
                        else{
                            ToastAndroid.show(
                                'No more results found',
                                ToastAndroid.SHORT,
                                ToastAndroid.BOTTOM,
                              );
                        }*/
                    }
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