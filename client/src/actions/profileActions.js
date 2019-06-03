import axios from 'axios'
import {FETCH_USER, DELETE_PICTURE} from './types'

export const fetchUserByUsername = (id) => dispatch => {
    axios.post('/api/account/fetch_user', {username: id})
        .then( res => {
            dispatch({
                type: FETCH_USER,
                payload: res.data
            })
        });
    return Promise.resolve();
};

export const deletePicture = (id, pic) => dispatch => {
    console.log(id, pic);
    axios.post('/api/account/delete_picture', {acc_id: id, pic: pic})
        .then( res => {
            dispatch({
                type: DELETE_PICTURE,
                payload: res.data
            })
        });
    return Promise.resolve();
};