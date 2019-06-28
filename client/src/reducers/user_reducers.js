import {REGISTER_USER, LOGIN_USER, FORGOT_PASSWORD, RESET_PASSWORD, VERIFY_TOKEN, USER_INFO} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case REGISTER_USER:
            return {...state, res: action.payload};
        case LOGIN_USER:
            return {...state, res: action.payload};
        case FORGOT_PASSWORD:
            return {...state, res: action.payload};
        case RESET_PASSWORD:
            return {...state, res: action.payload};
        case VERIFY_TOKEN:
            return {...state, res: action.payload};
        case USER_INFO:
            return {...state, info: action.payload};
        default:
            return state;
    }
}
