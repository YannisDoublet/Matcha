import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import './chatMessage.css'

const ChatMessage = (props) => {
    let msg = props.msg;
    let auth = props.auth;
    return (
        <div className={classnames('', {'my_message': msg.sender_id === auth.id, 'others_message': msg.sender_id !== auth.id})}>
            <p className={'message'}>{msg.message}</p>
            <p className={'date'}>{moment(parseInt(msg.date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
        </div>
    );
};

export default ChatMessage;