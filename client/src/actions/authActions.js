import axios from 'axios'
import {REGISTER_USER, LOGIN_USER} from "./types";

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
        .then( res => {
            dispatch({
                type: LOGIN_USER,
                payload: res.data
            })
        });
};