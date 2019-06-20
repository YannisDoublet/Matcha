import {MATCH_SUGGESTION, RESEARCH_USERS, FETCH_TAGS, FETCH_COUNT} from "../actions/types";

export default function(state={}, action) {
    switch(action.type) {
        case MATCH_SUGGESTION:
            return {...state, users: action.payload};
        case RESEARCH_USERS:
            return {...state, research: action.payload};
        case FETCH_TAGS:
            return {...state, tags: action.payload};
        case FETCH_COUNT:
            return {...state, count: action.payload};
        default:
            return state;
    }
}