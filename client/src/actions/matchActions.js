import axios from 'axios'
import {MATCH_SUGGESTION} from './types'

export const matchSuggestion = (user, count) => dispatch => {
    axios.post('/api/matcher/match_suggestion',{user: user, count: count})
        .then(res => {
            dispatch({
                type: MATCH_SUGGESTION,
                payload: res.data
            });
        });
};