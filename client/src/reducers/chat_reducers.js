import {HAS_MATCHED} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case HAS_MATCHED:
            return {...state, res: action.payload};
        default:
            return state;
    }
}