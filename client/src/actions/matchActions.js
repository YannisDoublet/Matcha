import axios from 'axios'
import {MATCH_SUGGESTION, FETCH_TAGS} from './types'

export const matchSuggestion = (user, count) => dispatch => {
    axios.post('/api/matcher/match_suggestion',{user: user, count: count})
        .then(res => {
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