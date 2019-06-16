import axios from 'axios'
import {MATCH_SUGGESTION, RESEARCH_USERS, FETCH_TAGS} from './types'

export const matchSuggestion = (user, count) => dispatch => {
    axios.post('/api/matcher/match_suggestion',{user: user, count: count})
        .then(res => {
            console.log(res.data);
            dispatch({
                type: MATCH_SUGGESTION,
                payload: res.data
            });
        });
};

export const fetchTags = () => dispatch => {
    axios.get('/api/matcher/fetch_tags')
        .then(res => {
            dispatch({
                type: FETCH_TAGS,
                payload: res.data
            });
        });
};

export const researchUsers = (acc_id, name, lat, lng) => dispatch => {
    console.log(name, lat, lng);
    axios.post('/api/matcher/research_users', {acc_id: acc_id, name: name, lat: lat, lng: lng})
        .then(res => {
            dispatch({
                type: RESEARCH_USERS,
                payload: res.data
            });
        });
};