import {SERVER_URL} from '../../Constants';
export const fetchEvents = async () => {
    var dateNow = new Date();
    var curMonth = ((dateNow.getMonth()+1) >= 10)?(dateNow.getMonth()+1):'0'+(dateNow.getMonth()+1);
    var curDate = (dateNow.getDate() >= 10)?dateNow.getDate():'0'+dateNow.getDate();
    var curDate = dateNow.getFullYear()+'-'+curMonth+'-'+curDate;
    var curMinute = (dateNow.getMinutes() >= 10)?dateNow.getMinutes():'0'+dateNow.getMinutes();
    var curSeconds = (dateNow.getSeconds() >= 10)?dateNow.getSeconds():'0'+dateNow.getSeconds();
    var curHours = (dateNow.getHours() >= 10)?dateNow.getHours():'0'+dateNow.getHours();
    var curTime = curHours+':'+curMinute+':'+curSeconds;
    return await fetch(SERVER_URL+'?action=getMapMarkers&curTime='+curTime+'&curDate='+curDate)
    .then(response=>response.json())
    .then(res=>{
        if(res.code == 200){
            const markers= res.body;
            return markers.map(el => ({
                ...el,
                group_lat: +el.group_lat,
                group_lng: +el.group_lng,
                coordinate: {
                    latitude: +el.group_lat,
                    longitude: +el.group_lng
                }
            }))
        }
    })
};