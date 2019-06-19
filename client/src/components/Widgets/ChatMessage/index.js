import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import './chatMessage.css'

const ChatMessage = (props) => {
    let msg = props.msg;
    return (
        <div className={classnames('', {'my_message': msg.sender_id === 'me', 'others_message': msg.sender_id === 'others'})}>
            <p className={'message'}>{msg.message}</p>
            <p className={'date'}>{moment(parseInt(msg.date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
        </div>
    );
};

export default ChatMessage;