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
        return <TagName />
    }
    
}
export default TabContianer