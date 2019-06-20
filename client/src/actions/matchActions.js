import axios from 'axios'
import {MATCH_SUGGESTION, LIKE_USER, DISLIKE_USER, RESEARCH_USERS, FETCH_TAGS, FETCH_COUNT} from './types'

export const fetchCount = (acc_id) => dispatch => {
    axios.post('/api/matcher/fetch_count', {acc_id: acc_id})
        .then(res => {
            dispatch({
                type: FETCH_COUNT,
                payload: res.data.length
            })
        })
};

export const matchSuggestion = (user, count, id) => dispatch => {
    axios.post('/api/matcher/match_suggestion',{user: user, count: count, id: id})
        .then(res => {
            console.log(res.data);
            dispatch({
                type: MATCH_SUGGESTION,
                payload: res.data
            });
        });
};

export const likeUser = (id, username) => dispatch => {
    axios.post('/api/matcher/like_user',{acc_id: id, username: username})
        .then(res => {
            console.log(res.data);
            dispatch({
                type: LIKE_USER,
                payload: res.data
            });
        });
};

export const dislikeUser = (id, username) => dispatch => {
    axios.post('/api/matcher/dislike_user',{acc_id: id, username: username})
        .then(res => {
            console.log(res.data);
            dispatch({
                type: DISLIKE_USER,
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

