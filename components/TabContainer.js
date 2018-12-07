import React, { Component } from 'react';
import EventsList from './EventsList';
import CreateEvent from './CreateEvent';
import MapScreen from './MapScreen';
class TabContianer extends Component  {
    TC = {
        EL : EventsList,
        CE : CreateEvent,
        map : MapScreen
    }
    render(){
        console.log('Latitude',this.props.showContainer.latitude);
        const TagName = this.TC[this.props.showContainer.TabComponent];
        return <TagName coords={{latitude:this.props.showContainer.latitude,longitude:this.props.showContainer.longitude}}/>
    }
    
}
export default TabContianer