import {FETCH_MESSAGES, HAS_MATCHED, SEND_MESSAGE} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case HAS_MATCHED:
            return {...state, res: action.payload};
        case FETCH_MESSAGES:
            return {...state, message: action.payload};
        case SEND_MESSAGE:
            return {...state};
        default:
            return state;
    }
}