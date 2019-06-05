import axios from 'axios';
import {HAS_MATCHED} from './types';

export const fetchCard = (id) => dispatch => {
    axios.post('/api/chat/fetch_card', {id: id})
        .then(res => {
            dispatch({
                type: HAS_MATCHED,
                payload: res.data
            })
        })
};


