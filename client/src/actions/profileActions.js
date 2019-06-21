import axios from 'axios'
import {
    FETCH_USER, CHECK_LIKES, CHANGE_INFO, UPDATE_LOCATION, ADD_TAG, DELETE_TAG, MANAGE_BIO,
    UPLOAD_PICTURE, UPDATE_PROFILE_PICTURE, DELETE_PICTURE, BLOCK_USER, UNBLOCK_USER, REPORT_USER, CHECK_BLOCKED
} from './types'

export const fetchUserByUsername = (id) => dispatch => {
    axios.post('/api/account/fetch_user', {username: id})
        .then(res => {
            dispatch({
                type: FETCH_USER,
                payload: res.data
            })
        });
    return Promise.resolve();
};

export const checkLike = (acc_id, username) => dispatch => {
    axios.post('/api/account/check_likes', {acc_id, username})
        .then(res => {
            dispatch({
                type: CHECK_LIKES,
                payload: res.data
            })
        })
};

export const checkBlock = (acc_id, username) => dispatch => {
    axios.post('/api/account/check_block', {acc_id, username})
        .then(res => {
            dispatch({
                type: CHECK_BLOCKED,
                payload: res.data
            });
        });
    return Promise.resolve();
};

export const changeInfo = (acc_id, name, value) => dispatch => {
    axios.post('/api/account/change_info', {acc_id, name: name, value: value})
        .then(res => {
            dispatch({
                type: CHANGE_INFO,
                payload: res.data
            });
        })
};

export const updateLocation = (acc_id, lat, lng) => dispatch => {
    axios.post('/api/account/change_location', {acc_id: acc_id, lat: lat, lng: lng})
        .then(res => {
            dispatch({
                type: UPDATE_LOCATION,
                payload: res.data
            });
        })
};

export const addTag = (id, tag) => dispatch => {
    axios.post('/api/account/add_tag', {acc_id: id, tag: tag})
        .then(res => {
            dispatch({
                type: ADD_TAG,
                payload: res.data
            })
        });
};

export const deleteTag = (id, tag) => dispatch => {
    axios.post('/api/account/delete_tag', {acc_id: id, tag: tag})
        .then(res => {
            dispatch({
                type: DELETE_TAG,
                payload: res.data
            })
        });
};

export const manageBio = (id, bio) => dispatch => {
    axios.post('/api/account/manage_bio', {acc_id: id, bio: bio})
        .then(res => {
            dispatch({
                type: MANAGE_BIO,
                payload: res.data
            })
        });
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

export const reportUser = (acc_id, username, pattern, message) => dispatch => {
    console.log(acc_id, username, pattern, message);
    axios.post('/api/account/report_user', {acc_id, username, pattern, message})
        .then(res => {
            console.log(res);
            dispatch({
                type: REPORT_USER,
                payload: res.data
            })
        })
};

export const blockUser = (acc_id, username) => dispatch => {
    axios.post('/api/account/block_user', {acc_id, username})
        .then(res => {
            console.log(res);
            dispatch({
              type: BLOCK_USER,
              payload: res.data
            })
        })
};

export const unblockUser = (acc_id, username) => dispatch => {
    axios.post('/api/account/unblock_user', {acc_id, username})
        .then(res => {
            console.log(res);
            dispatch({
                type: UNBLOCK_USER,
                payload: res.data
            })
        })
};
