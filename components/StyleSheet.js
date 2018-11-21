import React from 'react';
import { StyleSheet } from 'react-native';

const MainStyles = StyleSheet.create({
    container : {
        flex :1,
        backgroundColor:'#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft:20,
        paddingRight:20,
        textAlign:'center'
    },
    btn:{
        width:'100%',
        marginTop:10,
        backgroundColor:'#8da6d5',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da'
    },
    linBtn:{
        backgroundColor:'#0077b5',
        color:'#FFF'
    },
    subHeading:{
        fontSize:16,
        color:'#232323'
    },
    mPHeading:{
        fontSize:18,
        color:'#416bb9',
        marginTop : 10,
        fontFamily:'Robot-Light',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default MainStyles;