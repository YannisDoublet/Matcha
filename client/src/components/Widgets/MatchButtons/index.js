import React from 'react';
import './match_buttons.css'

const MatchButtons = (props) => {
    const id = props.id;
    const username = props.username;
    return (
        <div id={'match_buttons_container'}>
            <button id={'dislike_button_card'} onClick={() => props.dislike(id, username)}>
                <i className="fas fa-heart-broken" />
            </button>
            <button id={'like_button_card'} onClick={() => props.like(id, username)}>
                <i className="fas fa-heart" />
            </button>
        </div>
    );
};

export default MatchButtons;
