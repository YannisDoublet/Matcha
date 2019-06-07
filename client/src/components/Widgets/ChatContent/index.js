import React from 'react'
import ChatMessage from '../ChatMessage'
import './chatContent.css'

const ChatContent = (props) => {
    let msg = props.message ? props.message : null;
    let auth = props.id ? props.id : null;

    const renderMessage = (auth) => (
        msg.map((msg, i) => {
                msg.sender_id = msg.sender_id !== auth.id ? 'others' : 'me';
                return <ChatMessage key={i} msg={msg}/>
            }
        )
    );

    return (
        <div id={'chat_content_container'}>
            {renderMessage(auth)}
        </div>
    );
};

export default ChatContent;