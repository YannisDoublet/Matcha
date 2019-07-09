import {GET_NOTIFICATIONS, READ_NOTIFICATIONS} from '../actions/types'

export default function(state={}, action) {
    switch(action.type) {
        case GET_NOTIFICATIONS:
            return {...state, all: action.payload};
        case READ_NOTIFICATIONS:
            return {...state, read: action.payload};
        default:
            return state;
    }
}