import {FETCH_USER, ADD_TAG, DELETE_TAG, MANAGE_BIO,
    UPLOAD_PICTURE, UPDATE_PROFILE_PICTURE, DELETE_PICTURE} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case FETCH_USER:
            return {...state, res: action.payload};
        case ADD_TAG:
            return {...state, tag: action.payload};
        case DELETE_TAG:
            return {...state, tag: action.payload};
        case MANAGE_BIO:
            return {...state, bio: action.payload};
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
