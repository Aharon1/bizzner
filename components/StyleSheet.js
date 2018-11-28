import { StyleSheet, Dimensions } from 'react-native';
win = Dimensions.get('window');
const MainStyles = StyleSheet.create({
    container : {
        flex :1,
        backgroundColor:'#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft:20,
        paddingRight:20,
        textAlign: 'center',
    },
    minContainer :{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width:'100%'
    },
    btn:{
        width:'100%',
        marginTop:10,
        marginBottom:10,
        color : '#fff',        
    },
    linBtn:{
        /*backgroundColor:'#0077b5',
        marginBottom: 20,
        color : '#fff',*/
        //shadowColor: '#000',
        
        /*shadowRadius: 15,
        shadowOffset: {width:10,height:10},*/
        marginTop:30,
        shadowOpacity: 1,
    },
    linBtnImg:{
        shadowOpacity: 1,
    },
    emailBtn:{
        backgroundColor:'#8da6d5',
        marginBottom: 20,
        color : '#fff',
    },
    sUpBtn:{
        backgroundColor:'#0947b9',
        marginBottom: 20,
        color : '#fff',
    },
    btnText:{
        textAlign:'center',
        color:'#fff',
        justifyContent:'center',
        alignItems: 'center',
    },
    btnImg:{
        alignItems: 'center',
        justifyContent: 'center',
        width:win.width
    },
    orImg:{
        marginTop:40,
        marginBottom:40
    },
    btnWrapper:{
        width:'100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20
    },
    subHeading:{
        fontSize:16,
        color:'#232323'
    },
    mPHeading:{
        fontSize:17,
        color:'#416bb9',
        marginTop : 10,
        fontFamily:'RobotoLight',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom:20
    },
    saperator:{
        color:'#8da6d5'
    },

});

export default MainStyles;