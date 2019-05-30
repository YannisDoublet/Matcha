import React from 'react'
import classnames from 'classnames'
import './chatBanner.css'

const ChatBanner = (props) => {
    let user = props.user;
    let status = props.user.status;
    return (
        <div className={'chat_banner_container'}>
            <p className={classnames('', {
                'chat_banner_user_status_online': status === 'Online',
                'chat_banner_user_status_offline': status === 'Offline',
            })}>{user.name}</p>
        </div>
    );
};

export default ChatBanner;