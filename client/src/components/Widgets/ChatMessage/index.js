import React from 'react'
import classnames from 'classnames'
import './chatMessage.css'

const ChatMessage = (props) => {
    let msg = props.msg;

    return (
        <div className={classnames('', {'my_message': msg.author === 'me', 'others_message': msg.author === 'others'})}>
            <p className={'message'}>{msg.content}</p>
            <p className={'date'}>{msg.date}</p>
        </div>
    );
};

export default ChatMessage;