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
    normalContainer:{
        backgroundColor:'#FFF',
        flex:1
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
        shadowColor: '#000',
        shadowRadius: 7,
        shadowOffset: {width:0,height:0},
        marginTop:30,
        shadowOpacity: 0.4,
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
        marginTop:20,
        marginBottom:20
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
        fontFamily:'Roboto-Light',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom:20
    },
    saperator:{
        color:'#8da6d5'
    },
    profileHeader:{
        backgroundColor:'#2e4d85',
        height:100,
        paddingTop: 20,
        overflow: 'visible',
        paddingLeft:30,
        flexDirection:'row'
    },
    pHeadPicWrapper:{
        position:'relative'
    },
    pHeadPic:{
        width:130,
        height:130,
        borderWidth: 5,
        borderColor: '#FFF',
        backgroundColor:'#d1dbed',
        borderRadius: 70,
        marginBottom:20,
        overflow: 'hidden',
        alignItems:'center',
        justifyContent:'center'
    },
    pHeadPicEditBtnWrapper:{
        position:'absolute',
        top:5,
        left:100,
    },
    pHeadPicEditBtn:{
        backgroundColor:'#8da6d4',
        color:'rgba(255,255,255,0.8)',
        width:33,
        height:33,
        borderRadius:50,
        alignItems:'center',
        textAlign:'center',
        justifyContent:'center',
        padding:0
    },
    pHeadPicEditBtnI:{
        color:'rgba(255,255,255,0.8)',
        fontSize:18
    },
    pHeadPicOptions:{
        position:"absolute",
        width: 120,
        top: 40,
        backgroundColor:'#FFF',
        borderRadius:5,
        elevation:3,
        borderWidth:1,
        borderColor:'#dedede'
    },
    pHPOBtn:{
        width:'100%',
        padding:10,
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center',
        fontFamily:'Roboto-Medium',
    },
    profileTextWrapper:{
        paddingLeft:20,
        width:150
    },
    pTWText:{
        color:'#8da6d5',
        fontFamily:'Roboto-Medium',
        fontSize:13,
    },
    pTWNameText:{
        fontFamily:'Roboto-Light',
        fontSize:16,
        color:'#fff',
        marginTop:10
    },
    profileBody:{
        flex:1,
        marginTop:60,
        backgroundColor:'#fff',
        paddingHorizontal:30,
    },
    inputFieldWithIcon:{
        borderBottomColor:'#8da6d4',
        borderBottomWidth: 1,
        paddingBottom: 5,
        flex:1,
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent:'flex-start',
        marginBottom:20,
        position:'relative',
        overflow:'visible'
    },
    iFWIIcon:{
        color:'#416bb9',
        fontSize:18,
        paddingTop: 13,
        width:35,
        height:40,
    },
    ifWITI:{
        height:50,
        flex: 2,
        //flexDirection:'row',
        //paddingTop: 10,
        paddingRight: 10,
        //paddingBottom: 10,
        textAlign:'left',
        paddingLeft: 0,
        fontSize:18,
        fontFamily:'Roboto-Light'
    },
    iFWIPlus:{
        flex:2,
        width:40,
        height:40,
        alignItems:'flex-end',
        justifyContent: 'flex-end',
        textAlign:'left',
        borderRadius:50,
    },
    ifWIPlusIcon:{
        flex:2,
        color:'rgba(9,71,185,0.5)',
        fontSize:23,
        paddingTop: 10,
    },
    btnSave:{
        backgroundColor:'#0947b9',
        paddingTop:16,
        paddingBottom:16,
        paddingLeft:32,
        paddingRight:32,
        borderRadius:80,
        marginBottom:16
    },
    btnSaveText:{
        color:'#FFF',
        fontFamily:'Roboto-Regular',
        fontSize:20
    },
    confirmPopup:{
        padding:0
    },
    confirmPopupHeader:{
        height:50,
        backgroundColor:'#2e4d85',
        padding:10,
        width:'100%',
        flexDirection:'row',
    },
    cPCOption1:{
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingBottom:30,
        borderBottomColor:'#8da6d4',
        borderBottomWidth:1
    },
    cPCOption2:{
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingBottom:20,
        paddingTop:30,
    },
    eventsHeader:{
        height:60,
        backgroundColor:'#2e4d85',

    },
    tabContainer:{
        backgroundColor:'#fff',
        paddingLeft:15,
        paddingRight:15,
        shadowRadius:2,
        shadowOpacity:0.3,
        shadowOffset:{width:3,height:3},
        elevation:5,
        shadowColor:'#000'
    },
    tabItem:{
        height:45,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    tabItemIcon:{
        color:'#8da6d5',
        fontSize:16,
        marginRight: 6,
    },
    tabItemText:{
        color:'#8da6d5',
        fontFamily:'Roboto-Medium',
        fontSize:16
    },
    tabItemActive:{
        borderBottomColor:'#05296c',
        borderBottomWidth:4
    },
    tabItemActiveIcon:{color:'#05296c',},
    tabItemActiveText:{color:'#05296c',},
    EventScreenTabWrapper:{
        backgroundColor:'#d1dbed',
        paddingHorizontal:10,
        paddingVertical:5,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    ESTWItem:{
        width:'48%',
        alignItems:'center',
        backgroundColor:'#2e4d85',
        paddingHorizontal:15,
        paddingVertical:5,
        borderRadius:10
    },
    ESTWIText:{
        fontFamily:'Roboto-Medium',
        fontSize:16,
        
    },
    EventItem:{
        padding:15,
        
        flexDirection:'row'
    },
    EIOnline:{
        backgroundColor:'#e8edf6',
    },
    EIOffline:{
        backgroundColor:'#d1dbed',
    },
    EventItemImageWrapper:{
        overflow:'hidden',
        width:70,
        height:70,
        backgroundColor:'#8da6d4'
        //alignItems:'center',
        //justifyContent:'center'
    },
    EventItemTextWrapper:{marginLeft:15,flexGrow: 1,width: 0,alignItems:'flex-start'},
    EITWName:{
        fontFamily:'Roboto-Regular',
        fontSize:15,
        color:'#03163a',
        alignItems:'flex-start'
    },
    EITWAddress:{
        fontFamily:'Roboto-Light',
        fontSize:14,
        color:'#03163a',
        paddingRight:5,
        flexWrap: 'wrap',
        alignItems:'flex-start'
    },
    EITWAction:{
        flexDirection:'row',
        marginTop:10,
        alignItems:'center'
    },
    EITWActionIcon:{
        marginRight:5,
    },
    EITWActionText:{
        fontSize:16,
        fontFamily:'Roboto-Medium'
    },
    EITWAIOnline:{color:'#39b549'},
    EITWATOnline:{color:'#39b549'},
    EITWAIOffline:{color:'#8da6d5'},
    EITWATOffline:{color:'#2f4d85'},
    EIAButtonsWrapper:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:10,
        paddingHorizontal:10
    },
    EIAButtons:{
        flex:1,
        flexDirection:'row',
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor:'#bbcae6',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
    },
    createEventFWI:{
        borderBottomColor:'#8da6d4',
        borderBottomWidth: 1,
        paddingBottom: 0,
        flex:1,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20,
        position:'relative',
        overflow:'visible'
    },
    cEFWIIcon:{
        color:'#7590c8',
        fontSize:18,
        paddingTop: 13,
        paddingRight: 0,
        paddingBottom: 0,
        width:35,
        height:45
    },
    cEFWITF:{
        height:50,
        flex: 1,
        flexDirection:'row',
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        fontSize:17,
        fontFamily:'Roboto-Light'
    },
    cEFWIPF:{
        height:50,
        width:'100%',
        flex: 1,
        flexDirection:'row',
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        
    },
    cEFWIDF:{
        borderWidth: 0,
        paddingTop:0,
        paddingBottom: 0,
        paddingRight: 0,
        paddingLeft: 0,
        marginLeft:0,
        height:'auto',
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        color:'#03163a'
    },
    locationItemBtn:{
       borderBottomColor:'#8da6d4',
       borderBottomWidth:1,
       paddingHorizontal:10,
       paddingVertical:10,
       textAlign:'left',
       alignItems:'flex-start',
       justifyContent:'flex-start',
       alignContent: 'flex-start',
    },
    locationItemWrapper:{
        width:'91%',
        marginHorizontal: 'auto',
        justifyContent:'center',
        left:15,
        maxHeight: 250,
        position:'absolute',
        backgroundColor:'#FFF',
        zIndex: 4000,
        borderColor:'#8da6d4',
        borderWidth:1,
        top:123,
        marginBottom:0,
        borderTopWidth: 0,
        elevation:3,
    },
    UserListItem:{
        padding:15,
        borderBottomColor:'#8da6d4',
        borderBottomWidth:1,
        flexDirection:'row',
        backgroundColor:'#e8edf6'
    },
    userListItemImageWrapper:{
        overflow:'hidden',
        width:90,
        height:90,
    },
    userListItemIWImage:{
        width: 90, 
        height: 90,
        borderRadius:100,
        borderWidth: 3,
        borderColor: '#FFF'
    },
    userListItemTextWrapper:{
        marginLeft:15,
        flexGrow: 1,
        width: 0,
        alignItems:'flex-start'
    },
    ULITWName:{
        fontFamily:'Roboto-Regular',
        fontSize:16,
        marginTop:5,
        color:'#03163a',
        alignItems:'flex-start'
    },
    ULITWTitle:{
        fontFamily:'Roboto-Light',
        fontSize:14,
        color:'#03163a',
        paddingRight:5,
        flexWrap: 'wrap',
        alignItems:'flex-start'
    },
    ULITWAction : {
        flexDirection:'row',
        marginTop:10,
        paddingVertical:2,
        paddingHorizontal:8,
        alignItems:'center',
        borderRadius:15,
        backgroundColor:'#88d392',
    },
    ULITWActionIcon:{
        fontSize:11,
        color:'#FFF',
        marginRight:5
    },
    ULITWActionText:{
        fontSize:11,
        color:'#FFF',
        fontFamily:'Roboto-Medium'
    },
    ChatIconWrapper:{
        justifyContent:'center',
        alignItems: 'center',
    },
    ChatIcon:{
        fontSize:35,
        color:'#8da6d5'
    },
    eventDataHeader:{
        backgroundColor:'#fff',
        flexDirection:'row',
        paddingVertical:5,
        paddingHorizontal:15,
        shadowRadius:2,
        shadowOpacity:0.3,
        shadowOffset:{width:2,height:2},
        elevation:5,
        shadowColor:'#232323'
    },
    MessageContainer:{
        flex:1
    },
    MessageContainerTextInput:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:5,
        paddingVertical:10,
        backgroundColor:'#FFF'
    },
    MsgBtnDisable:{
        opacity:0.6
    },
    MsgBtnEnable:{
        opacity:1
    },
    profileTextItem:{
        flexDirection:'row',
        marginTop:10,
        borderBottomColor:'#8da6d4',
        borderBottomWidth:1,
        marginBottom:15,
        paddingBottom:8,
    },
    profileTextItemIcon:{color:'#416bb9',marginRight:15,marginTop:5},
    PTIText:{
        fontFamily:'Roboto-Regular',
        fontSize:16,
        color:'#03163a'
    }
});

export default MainStyles;