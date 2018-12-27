import React, { Component } from 'react';
import MapScreen from './MapScreen';
class TabContianer extends Component {
    TC = {
        map: MapScreen
    }
    render() {
        const TagName = this.TC[this.props.showContainer.TabComponent];
        return <TagName navigation={this.props.navigation}/>
    }

}
export default TabContianer