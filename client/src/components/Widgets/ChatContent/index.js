import React from 'react'
import ChatMessage from '../ChatMessage'
import './chatContent.css'

const ChatContent = (props) => {
    let user = props.user;
    const msg = [
        {author: 'me', content: 'Salut mon pote !', date: 'Mai 29 2019, 15:51'},
        {author: 'others', content: 'Salut !', date: 'Mai 29 2019, 15:55'},
        {author: 'me', content: 'T ki', date: 'Mai 29 2019, 15:59'},
        {author: 'others', content: 'Allo', date: 'Mai 29 2019, 16:01'},
    ];

    const renderMessage = () => (
        msg.map((msg, i) => (
                <ChatMessage key={i} msg={msg}/>
            )
        )
    );

    return (
        <div id={'chat_content_container'}>
            {renderMessage()}
        </div>
    );
};

export default ChatContent;