import React from 'react'
import ChatMessage from '../ChatMessage'
import './chatContent.css'

const ChatContent = (props) => {
    let msg = props.message ? props.message : null;
    let auth = props.id ? props.id : null;

    const renderMessage = (auth) => (
        msg.map((msg, i) => {
                return <ChatMessage key={i} msg={msg} auth={auth}/>
        })
    );

    return (
        <div id={'chat_content_container'}>
            {renderMessage(auth)}
        </div>
    );
};

export default ChatContent;