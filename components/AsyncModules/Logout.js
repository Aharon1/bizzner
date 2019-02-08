import React, {Component} from 'react';
import {View,AsyncStorage,Image} from 'react-native';
import Loader from '../Loader';
class Logout extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
        }
        //this.authenticateSession = this._authenticateSession.bind(this);
    }
    async saveDetails(key,value){
        await AsyncStorage.setItem(key,value);
    }
    authenticateSession(){
        this.saveDetails('isUserLoggedin','false');
        setTimeout(()=>{
            this.setState({loading:false});
            this.props.navigation.navigate('Auth');
        },1000);
        
    }
    componentDidMount(){
        this.authenticateSession();
        console.log('is mounted');
    }
    render(){
        return(
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                <Loader loading={this.state.loading} />
                <Image source={require('../../assets/bizzner-logo.png')} style={{height:72}}/>
            </View>
        );
    }
}
export default Logout;