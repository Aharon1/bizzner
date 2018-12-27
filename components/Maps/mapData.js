import {SERVER_URL} from '../../Constants';
export const fetchEvents = async () => {
    return await fetch(SERVER_URL+'?action=getMapMarkers')
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