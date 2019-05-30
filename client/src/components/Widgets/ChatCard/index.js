import React from 'react';
import './chat_card.css'

const ChatCard = (props) => {
    let user = props.user;
    return (
        <div id={props.id} className={'chatCard_container'} onClick={(evt) => props.active(evt)}>
            <div className={'chatCard_thumbnail'} style={{backgroundImage: `url(${user.pic})`}}/>
            <div className={'chatCard_user'}>
                <div className={'chatCard_info'}>
                    <p className={'chatCard_user_name'}>{user.name}</p>
                    {parseInt(user.unread_msg) > 0 && <div className={'chatCard_notif'}>{user.unread_msg}</div>}
                </div>
                <p className={'chatCard_last_msg'}>{user.last_msg}</p>
            </div>
            <p className={'chatCard_date'}>{user.last_msg_time}</p>
        </div>
    );
};

export default ChatCard;