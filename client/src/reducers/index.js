import {combineReducers} from 'redux'
import user from './user_reducers'
import profile from './profile_reducers'
import chat from './chat_reducers'
import match from './match_reducers'

const rootReducer = combineReducers({
    user,
    profile,
    chat,
    match
});

export default rootReducer