import React, {Fragment} from 'react'
import classnames from 'classnames'
import './chatBanner.css'

const ChatBanner = (props) => {
    if (props.user) {
        let user = props.user;
        let status = props.user.connection;
        return (
            <div className={'chat_banner_container'}>
                <i className={"fas fa-bars"} onClick={(evt) => props.toggle(evt)}/>
                <p className={classnames('', {
                    'chat_banner_user_status_online': status === 'Online',
                    'chat_banner_user_status_offline': status !== 'Online',
                })}>{user.firstname + ' ' + user.lastname}</p>
            </div>
        );
    } else {
        return <Fragment/>;
    }
};

export default ChatBanner;