import  React,{PureComponent} from 'react';
import {View,TouchableOpacity, Text,Image} from 'react-native';
import MainStyles from '../StyleSheet';
import { MAPKEY } from '../../Constants';
import ProgressiveImage from './ImageComponent';
class LocationItem extends PureComponent{
    _handlePress = async()=>{
        await this.props.fecthDetails(await this.props);
    }
    render(){
        
        let indexing = (this.props.indexing+1);
        
        if(indexing > 10){
            indexing = indexing-10;
        }
        let imageURl = "http://bizzner.com/app/assets/images/default-result-"+indexing+".png";
        return (
            <TouchableOpacity onPress={this._handlePress} style={[MainStyles.locationItemBtn,{flexDirection:'row'}]}>
                <View style={{ width: 50, height: 70,alignItems:'flex-start',paddingRight:5}}>
                    {/*
                        typeof(this.props.photos) != "undefined" && 
                        <ProgressiveImage source={{uri:'https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference='+this.props.photos[0].photo_reference+'&key='+MAPKEY}} style={{ width: 50, height: 70}} resizeMode="cover"/>
                    }
                    {
                        typeof(this.props.photos) == "undefined" && 
                        <ProgressiveImage source={{uri:'http://bizzner.com/app/assets/images/default.jpg'}} style={{width:50,height:70}} resizeMode="cover"/>*/
                        <ProgressiveImage source={{uri:imageURl}} style={{width:50,height:70}} resizeMode="cover"/>
                    }
                </View>
                
                <View style={{flexDirection: 'column',flexWrap: 'wrap',paddingLeft:5,justifyContent:'center', alignItems:'flex-start',flex:1}}>
                    <Text style={{writingDirection:'ltr',textAlign:'left',fontFamily:'Roboto-Medium'}}>{this.props.name}</Text>
                    <Text style={{writingDirection:'ltr',textAlign:'left',fontFamily:'Roboto-Light'}}>
                        {this.props.formatted_address}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}
export default LocationItem;