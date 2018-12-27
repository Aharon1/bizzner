import React,{Component} from 'react';
import {View,AsyncStorage,Image} from 'react-native';
import MainStyles from './StyleSheet';
import Loader from './Loader';
class SplashScreen extends Component{
    constructor(props) {
        super(props);
        this.state={loading:false}
        this.authenticateSession();
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
      }
    authenticateSession = async()=> {
        const { navigation } = this.props;
        let isUserLoggedIn = await AsyncStorage.getItem('isUserLoggedin');
        if(isUserLoggedIn == 'true'){
          navigation.navigate('Home');
        }
        else{
            navigation.navigate('Auth');
        }
      }
    render(){
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <Image source={require('../assets/bizzner-logo.png')} style={{height:72}}/>
            </View>
        );
    }
}

export default SplashScreen;