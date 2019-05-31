import {combineReducers} from 'redux'
import user from './user_reducers'
import profile from './profile_reducers'

const rootReducer = combineReducers({
    user,
    profile
});

export default rootReducer