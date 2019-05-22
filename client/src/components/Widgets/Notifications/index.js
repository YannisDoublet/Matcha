import React, {Component} from 'react'
import classnames from 'classnames'
import './notifications.css'

class Notifications extends Component {

    state = {
    };

    renderNotification = (notifications) => {
        return notifications.map((notif, i) => (
            <div key={i} id={`notifications ${i}`} className={'notifications_container'}>
                <img src={notif.img} id={`notifications_img ${i}`} className={'notifications_img'} alt={'notification_img'}/>
                <p id={`notifications_msg ${i}`} className={'notifications_msg'}>{notif.msg}</p>
            </div>
        ))
    };

    render() {
        const notif = this.props.notifications;
        const number = this.props.number;
        const opened = this.props.opened;
        return (
            <div id={'notifications_wrapper'} onClick={(evt) => this.props.toggle(evt)}>
                {number > 0 && <div id={'notifications_numbers'}>{number}</div>}
                <div id={'notifications_container'}>
                    <div id={'notifications_dropdown'} className={classnames('', {'show': opened})}>
                        <div id={'triangle'} className={classnames('', {'show': opened})}/>
                        <div id={'notifications_title'} className={classnames('', {'show': opened})}>
                            <p id={'notifications'}>Notifications</p>
                        </div>
                        <div id={'notifications_content'}>
                            {this.renderNotification(notif)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notifications;