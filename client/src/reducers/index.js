import {combineReducers} from 'redux'
import user from './user_reducers'
import profile from './profile_reducers'
import chat from './chat_reducers'
import match from './match_reducers'
import notifications from './notification_reducers'

const rootReducer = combineReducers({
    user,
    profile,
    chat,
    match,
    notifications
});

export default rootReducer