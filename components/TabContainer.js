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
<<<<<<< HEAD
        return <TagName locationList={this.props.showContainer.locationList} npt={this.props.showContainer.npt} fetchDetails={this.props.showContainer.fetchDetails}/>
=======
        return <TagName locationList={this.props.showContainer.locationList} fetchDetails={this.props.showContainer.fetchDetails} npt={this.props.showContainer.npt}/>
>>>>>>> MustafaCode
    }
    
}
export default TabContianer