import {REGISTER_USER, LOGIN_USER, VERIFY_TOKEN, USER_INFO, LOGOUT_USER, FETCH_USER} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case REGISTER_USER:
            return {...state, res: action.payload};
        case LOGIN_USER:
            return {...state, res: action.payload};
        case VERIFY_TOKEN:
            return {...state, res: action.payload};
        case USER_INFO:
            return {...state, info: action.payload};
        case FETCH_USER:
            return {...state, profile: action.payload};
        default:
            return state;
    }
}
