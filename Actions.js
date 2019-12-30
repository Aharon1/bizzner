export const actionUserSignIn = (userData) => {
    return {
        type: 'USER_SIGNIN',
        userData
    };
};
export const checkAuthentication = (dataSet) => {
    return {
        type: 'CHECK_AUTH',
        dataSet
    };
};
export const loadingChange = (loading)=>{
    return {
        type:'LOADING_CHANGE',
        loading
    }
}
export const LogoutAction = ()=>{
    return {
        type:'LOGOUT_ACTION',
        userData:null
    }
}
export const updateProfileAction = (userData)=>{
    return {
        type:'UPDATE_PROFILE',
        userData
    }
}
export const ShowSearchAction = (isSearchOpen)=>{
    return {
        type:'SEARCH_TOGGLE',
        isSearchOpen
    }
}
export const SaveUserLocation = (userLat,userLng)=>{
    return{
        type:'SAVE_USER_LOCATION',
        userLat,
        userLng
    }
}