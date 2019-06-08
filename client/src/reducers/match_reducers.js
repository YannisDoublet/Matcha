import {MATCH_SUGGESTION} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case MATCH_SUGGESTION:
            return {...state, users: action.payload};
        default:
            return state;
    }
}