import {FETCH_USER, DELETE_PICTURE, UPLOAD_PICTURE} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case FETCH_USER:
            return {...state, res: action.payload};
        case UPLOAD_PICTURE:
            return {...state, pic: action.payload};
        case DELETE_PICTURE:
            return {...state, pic: action.payload};
        default:
            return state;
    }
}
