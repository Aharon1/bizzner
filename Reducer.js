import { combineReducers } from 'redux';
const INITIAL_STATE = { 
    loading: false, 
    userData: null, 
    error: null, 
    authorized: false,
    isSearchOpen:false,
    userLat:'',
    userLng:''
};
const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'USER_SIGNIN':
            return processUserSignIn(state, action);
        case 'CHECK_AUTH':
            return processCheckAuthentication(state, action);
        case 'LOADING_CHANGE':
            return changeLoadingStatus(state, action);
        case 'LOGOUT_ACTION':
            return processUserSignOut(state, action);
        case 'UPDATE_PROFILE':
            return processUpdateProfile(state, action);
        case 'SEARCH_TOGGLE':
            return toggleSearchOption(state,action);
        case 'SAVE_USER_LOCATION':
            return SaveUserLocation(state,action);
        default:
            return state
    }
};
export default combineReducers({
    reducer
});
processUserSignIn = (state, action) => {
    return {
        ...state,
        userData: action.userData,
        authorized: true,
    };
}
processCheckAuthentication = (state, action) => {
    let dataSet = action.dataSet;
    return {
        ...state,
        userData: dataSet.userData,
        authorized: dataSet.authorized,
        lang:dataSet.lang
    }
}
changeLoadingStatus = (state, action) => {
    state['loading'] = action.loading;
    return {
        ...state
    }
}
processUserSignOut = (state, action) => {
    return {
        ...state,
        userData: null,
        authorized: false,
        lang:'en',
        isRTL:false
    };
}
processUpdateProfile = (state, action) => {
    return {
        ...state,
        userData: action.userData,
    };
}
toggleSearchOption = (state,action)=>{
    return {
        ...state,
        isSearchOpen: action.isSearchOpen,
    };
}
SaveUserLocation = (state,action)=>{
    return {
        ...state,
        userLat:action.userLat,
        userLng:action.userLng
    }
}