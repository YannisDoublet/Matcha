import axios from 'axios';
import {FETCH_MESSAGES, SEND_MESSAGE, HAS_MATCHED} from './types';

export const fetchCard = (id) => dispatch => {
    axios.post('/api/chat/fetch_card', {id: id})
        .then(res => {
            dispatch({
                type: HAS_MATCHED,
                payload: res.data
            })
        })
};

export const fetchMsg = (conv_id) => dispatch => {
    axios.post('/api/chat/fetch_messages', {conv_id: conv_id})
        .then(res => {
            dispatch({
                type: FETCH_MESSAGES,
                payload: res.data
            })
        })
};

export const sendMessage = (conv_id, sender, message) => dispatch => {
    axios.post('/api/chat/send_message', {conv_id: conv_id, sender: sender, message: message})
        .then(res => {
            dispatch({
                type: SEND_MESSAGE,
                payload: res.data
            })
        })
};



