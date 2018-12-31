import React,{Component} from 'react';
import { View,Text,StyleSheet} from 'react-native';
import ProgressiveImage from '../AsyncModules/ImageComponent';
class ChatItem extends Component{
    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    render(){
        const {msgItem} = this.props;
        const isMyMsg = (msgItem.send_by == 1)?true:false;
        return (
            <View style={Styles.msgContainer}>
                {
                    isMyMsg == false
                    &&
                    <View style={Styles.AvatarCont}>
                        <ProgressiveImage source={{uri:msgItem.send_user_pic}} style={Styles.msgAvatar} />
                    </View>
                }
                
                <View style={[Styles.msgTextCont,isMyMsg?{justifyContent:'flex-end',alignItems:'flex-end'}:'']}>
                    <View style={{flexDirection:'row'}}>
                        {
                            isMyMsg == false
                            && 
                            <Text style={Styles.msgSenderName}>{msgItem.send_user_name},</Text>
                        }
                        
                        <Text style={Styles.msgSenderName}>{this.formatAMPM(new Date(msgItem.send_on))}</Text>
                    </View>
                    <View style={isMyMsg?{justifyContent:'flex-end',alignItems:'flex-end'}:''}>
                        <Text style={[Styles.msgText,isMyMsg?{borderTopRightRadius:0,borderTopLeftRadius:5}:'']}>{msgItem.msg_text}</Text>
                    </View>
                </View>
                {/*
                    isMyMsg == true
                    &&
                    <View style={Styles.AvatarCont}>
                        <ProgressiveImage source={require('../../assets/dummy.jpg')} style={Styles.msgAvatar}/>
                    </View>
                */}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    msgContainer:{
        flexDirection:'row',
        padding:15
    },
    msgTextCont:{
        flex:1,
        flexDirection:'column',
        marginHorizontal: 10,
        borderRadius: 5,
    },
    msgSenderName:{
        color:'#2f4d85',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
    },
    msgText:{
        fontFamily:'Roboto-Light',
        color:'#03163a',
        fontSize:14,
        backgroundColor: '#e8edf7',
        padding:10,
        borderRadius:5,
        marginTop:10,
        borderTopLeftRadius: 0,
        alignSelf: 'flex-start'
    },
    AvatarCont:{
        width:60,
        height:60,
    },
    msgAvatar:{
        width:60,
        height:60,
        borderWidth: 3,
        borderColor: '#FFF',
        borderRadius:50
    },
})
export default ChatItem;