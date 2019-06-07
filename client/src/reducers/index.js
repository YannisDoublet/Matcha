import {combineReducers} from 'redux'
import user from './user_reducers'
import profile from './profile_reducers'
import chat from './chat_reducers'

const rootReducer = combineReducers({
    user,
    profile,
    chat
});

export default rootReducer