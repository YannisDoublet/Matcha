import React from 'react';
import './chat_card.css'

const ChatCard = (props) => {
    let user = props.user;
    return (
        <div id={props.id} className={'chatCard_container'} onClick={(evt) => props.active(evt)}>
            <div className={'chatCard_thumbnail'} style={{backgroundImage: `url(${user.picture})`}}/>
            <div className={'chatCard_user'}>
                <div className={'chatCard_info'}>
                    <p className={'chatCard_user_name'}>{user.firstname}</p>
                    <p className={'chatCard_date'}>{}</p>
                </div>
                <p className={'chatCard_last_msg'}>{}</p>
            </div>
        </div>
    );
};

export default ChatCard;