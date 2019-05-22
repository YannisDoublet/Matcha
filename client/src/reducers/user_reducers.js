import {REGISTER_USER, LOGIN_USER, LOGOUT_USER} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case REGISTER_USER:
            return {...state, res: action.payload};
        case LOGIN_USER:
            return {...state, res: action.payload};
        default:
            return state;
    }
}
