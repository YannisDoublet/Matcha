import {FETCH_USER, UPLOAD_PICTURE, UPDATE_PROFILE_PICTURE, DELETE_PICTURE} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case FETCH_USER:
            return {...state, res: action.payload};
        case UPLOAD_PICTURE:
            return {...state, pic: action.payload};
        case UPDATE_PROFILE_PICTURE:
            return {...state, pic: action.payload};
        case DELETE_PICTURE:
            return {...state, pic: action.payload};
        default:
            return state;
    }
}
