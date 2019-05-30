import React from 'react'
import './chatInput.css'

const ChatInput = () => {
    return (
        <form id={'chat_input_container'}>
            <input id={'chat_input'} type={'text'} placeholder={'Write a message...'} />
        </form>
    );
};

export default ChatInput;