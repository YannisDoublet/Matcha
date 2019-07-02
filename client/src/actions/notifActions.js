import axios from 'axios'
import {GET_NOTIFICATIONS, READ_NOTIFICATIONS} from './types'

export const getNotifications = (id) => dispatch => {
    axios.post('/api/notifications/get_notifications', {acc_id: id})
        .then(res => {
            dispatch({
                type: GET_NOTIFICATIONS,
                payload: res.data
            })
        })
};

export const readNotifications = (id) => dispatch => {
    axios.post('/api/notifications/read_notifications', {acc_id: id})
        .then(res => {
            dispatch({
                type: READ_NOTIFICATIONS,
                payload: res.data
            })
        })
};