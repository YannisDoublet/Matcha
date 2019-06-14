import axios from 'axios'
import {FETCH_USER, UPLOAD_PICTURE, UPDATE_PROFILE_PICTURE, DELETE_PICTURE} from './types'

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

export const uploadPicture = (data) => dispatch => {
    axios.post('/api/account/upload_picture', data)
        .then(res => {
            dispatch({
                type: UPLOAD_PICTURE,
                payload: res.data
            })
        });
};

export const updateProfilePicture = (acc_id, pic, pic_id) => dispatch => {
    axios.post('/api/account/update_profile_picture', {acc_id: acc_id, pic: pic, pic_id: pic_id})
        .then(res => {
            console.log(res);
            dispatch({
                type: UPDATE_PROFILE_PICTURE,
                payload: res.data
            })
        });
};

export const deletePicture = (acc_id, pic, pic_id) => dispatch => {
    axios.post('/api/account/delete_picture', {acc_id: acc_id, pic: pic, pic_id: pic_id})
        .then(res => {
            dispatch({
                type: DELETE_PICTURE,
                payload: res.data
            })
        });
};