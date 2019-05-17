import React, {Component} from 'react'
import classnames from 'classnames'
import './notifications.css'

class Notifications extends Component {

    state = {
    };

    renderNotification = (notifications, filter) => {
        const filtered = notifications.filter;
        return notifications.map((notif, i) => (
            <div key={i} id={i} className={'notif_container'}>
                <img src={notif.img} className={'notif_img'}/>
                <p className={'notif_msg'}>{notif.msg}</p>
            </div>
        ))
    };

    render() {
        const notif = this.props.notifications;
        const opened = this.props.opened;
        return (
            <div id={'notification_wrapper'} onClick={(evt) => this.props.toggle(evt)}>
                {notif.length > 0 && <div id={'notification_numbers'}>{notif.length}</div>}
                <div id={'notifications_container'}>
                    <div id={'notification_dropdown'} className={classnames('', {'show': opened})}>
                        <div id={'triangle'} className={classnames('', {'show': opened})}/>
                        <div id={'notification_title'} className={classnames('', {'show': opened})}>
                            <p>Notifications</p>
                        </div>
                        <div id={'notification_content'}>
                            {notif.length > 0 ? this.renderNotification(notif)
                                : <p id={'no_notification'}>No notifications</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notifications;