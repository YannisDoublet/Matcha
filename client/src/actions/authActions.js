import axios from 'axios'
import {REGISTER_USER, LOGIN_USER, VERIFY_TOKEN, USER_INFO} from "./types";

export const registerUser = (data) => dispatch => {
    axios.post('/api/account/register', data)
        .then(res => {
            dispatch({
                type: REGISTER_USER,
                payload: res.data
            })
        })
};

export const loginUser = (data) => dispatch => {
    axios.post('/api/account/login', data)
        .then(res => {
            dispatch({
                type: LOGIN_USER,
                payload: res.data
            })
        });
};

export const verifyToken = (token) => dispatch => {
    axios.post('/api/account/verify_token', {token: token})
        .then(res => {
            dispatch({
                type: VERIFY_TOKEN,
                payload: res.data
            })
        })
};

export const userInfo = (acc_id) => dispatch => {
    axios.post('/api/account/user_info', {acc_id: acc_id})
        .then(res => {
            console.log(res.data);
            dispatch({
                type: USER_INFO,
                payload: res.data
            })
        })
};