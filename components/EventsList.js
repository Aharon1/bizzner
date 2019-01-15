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
            _dataAfter: "",
            npt:'',
            resultsLost:false
        }
    }
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
    }
    render(){
        return (
            <FlatList data={this.state.data}
                renderItem={({item}) => (
                    <ListItem item={item} fetchDetails={this.props.fetchDetails}/>
                    )}
                onEndReached={()=>{
                            this.setState({ isLoadingMore: true }, () => this.fetchMore())
                    }
                }
                keyExtractor={(item) => item.key}
                ListFooterComponent={() => {
                    return (
                    this.state.isLoadingMore &&
                    <View style={{ flex: 1, padding: 10 }}>
                        <ActivityIndicator size="large" color="#416bb9"/>
                    </View>
                    );
                }}
            />
        );
    }
}
export default EventsList;