import axios from 'axios'
import {REGISTER_USER, LOGIN_USER, VERIFY_TOKEN, USER_INFO, FORGOT_PASSWORD, RESET_PASSWORD} from "./types";

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

export const sendForgotPassword = (email) => dispatch => {
    axios.post('/api/account/send_forgot_password', {email})
        .then(res => {
            dispatch({
                type: FORGOT_PASSWORD,
                payload: res.data
            })
        })
};

export const resetPassword = (password, code) => dispatch => {
    axios.post('/api/account/reset_password', {password, code})
        .then(res => {
            dispatch({
                type: RESET_PASSWORD,
                payload: res.data
            })
        })
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
            dispatch({
                type: USER_INFO,
                payload: res.data
            })
        })
};