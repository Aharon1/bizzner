import  React,{PureComponent} from 'react';
import {TouchableOpacity, Text,} from 'react-native';
import MainStyles from '../StyleSheet';
class LocationItem extends PureComponent{
    _handlePress = async()=>{
        await this.props.fecthDetails(await this.props);
    }
    render(){
        return (
            <TouchableOpacity onPress={this._handlePress} style={MainStyles.locationItemBtn}>
                <Text>{this.props.name}</Text>
            </TouchableOpacity>
        );
    }
}

export default LocationItem;