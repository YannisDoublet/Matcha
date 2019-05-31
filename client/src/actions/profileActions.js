import axios from 'axios'
import {FETCH_USER} from './types'

export const fetchUser = (id) => dispatch => {
    axios.post('/api/account/fetch_user', {username: id})
        .then( res => {
            dispatch({
                type: FETCH_USER,
                payload: res.data
            })
        });
    return Promise.resolve();
};