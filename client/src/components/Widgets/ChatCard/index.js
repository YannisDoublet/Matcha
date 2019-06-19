import React from 'react';
import moment from 'moment'
import './chat_card.css'

const ChatCard = (props) => {
    let user = props.user;
    let msg = props.user.msg;
    return (
        <div id={props.id} className={'chatCard_container'} onClick={(evt) => props.active(evt)}>
            <div className={'chatCard_thumbnail'} style={{backgroundImage: `url(${user.picture})`}}/>
            <div className={'chatCard_user'}>
                <div className={'chatCard_info'}>
                    <p className={'chatCard_user_name'}>{user.firstname}</p>
                    <p className={'chatCard_date'}>{msg ? moment(parseInt(msg.date)).fromNow() : 'Now'}</p>
                </div>
                <p className={'chatCard_last_msg'}>{msg.last_message ? msg.last_message : 'Send the first message !'}</p>
            </div>
        </div>
    );
};

export default ChatCard;