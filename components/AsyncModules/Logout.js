import React, {Component} from 'react';
import {View,AsyncStorage,Image} from 'react-native';
import Loader from '../Loader';
class Logout extends Component{
    constructor(props) {
        super(props);
        this.authenticateSession();
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    authenticateSession(){
        const { navigation } = this.props;
        this.saveDetails('isUserLoggedin','false');
        navigation.navigate('Auth');
      }
    render(){
        return(
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                <Image source={require('../../assets/bizzner-logo.png')} style={{height:72}}/>
            </View>
        );
    }
}
export default Logout;