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
        const TagName = this.TC[this.props.showContainer.TabComponent];
        return <TagName locationList={this.props.showContainer.locationList} fetchDetails={this.props.showContainer.fetchDetails} npt={this.props.showContainer.npt}/>
    }
    
}
export default TabContianer