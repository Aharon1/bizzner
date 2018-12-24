export const MOCKED_EVENTS = [
    {
        "id": 12,
        "group_name": "Cafe Geg",
        "group_lat": 32.0677475,
        "group_lng": 34.8442303,
        "event_date": "2018-12-25",
        "event_time": "03:04:00"
    },
    {
        "id": 13,
        "group_name": "Cafe Cafe Joel GS",
        "group_lat": 32.079394,
        "group_lng": 34.8438209,
        "event_date": "2018-12-20",
        "event_time": "03:04:00"
    },
    {
        "id": 14,
        "group_name": "Chai Kaapi TI Mall",
        "group_lat": 22.7212097,
        "group_lng": 75.87854709999999,
        "event_date": "2018-12-20",
        "event_time": "03:04:00"
    },
    {
        "id": 15,
        "group_name": "Cafe Zoom",
        "group_lat": 22.7213992,
        "group_lng": 75.8782578,
        "event_date": "2018-12-20",
        "event_time": "03:04:00"
    }
].map(el => ({
    ...el,
    coordinate: {
        latitude: el.group_lat,
        longitude: el.group_lng
    }
}))
