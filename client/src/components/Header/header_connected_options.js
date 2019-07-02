import React, {Component} from 'react'
import {connect} from 'react-redux'
import ProfileTag from '../Widgets/ProfileTag'
import Notifications from '../Widgets/Notifications'
import {userInfo} from "../../actions/authActions"
import {getNotifications, readNotifications} from '../../actions/notifActions'
import './header_connected_options.css'
import socketIOClient from "socket.io-client"
import {ENDPOINT} from "../../config/socket"

const socket = socketIOClient(ENDPOINT);

class HeaderConnectedOptions extends Component {
    state = {
        id: '',
        user_img: '',
        notifications: [],
        dropdown_content: [
            {img: '/assets/resume.svg', msg: 'My profile page', link: ''},
            {img: '/assets/settings-gears.svg', msg: 'Settings', link: ''},
            {img: '/assets/logout.svg', msg: 'Logout', link: '/logout'},
        ],
        notifications_number: 0,
        notification_opened: false,
        profile_tag_opened: false
    };

    componentWillMount() {
        this.props.dispatch(userInfo(this.props.id));
        this.setState({
            id: this.props.id
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.user.info !== this.props.user.info) {
            let newState = this.state;
            newState.user_img = nextProps.user.info.pictures[0].picture;
            newState.dropdown_content[0].link = `/profile/${nextProps.user.info.username}`;
            newState.dropdown_content[1].link = `/settings/${nextProps.user.info.username}`;
            this.setState({
                ...newState
            });
        } else if (nextProps.notifications !== this.props.notifications) {
            this.setState({
                notifications: nextProps.notifications,
                notifications_number: this.getNotificationsNumber(nextProps.notifications)
            });
        }
    }

    getNotificationsNumber = (notifications) => {
        notifications.forEach(notif => {
            if (notif.open === 0) {
            }
        });
    };

    hideDropdown = () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > this.state.scrollPosition) {
            this.setState({
                notification_opened: false,
                profile_tag_opened: false
            })
        }
        this.setState({
            scrollPosition: st <= 0 ? 0 : st
        })
    };

    untoggleDropdown = (evt) => {
        let target = evt.target;
        let notif = this.state.notification_opened;
        let tag = this.state.profile_tag_opened;
        if (target.id.indexOf('notifications') < 0 && target.id.indexOf('profile_tag') < 0
            && (notif || tag)) {
            this.setState({
                notification_opened: false,
                profile_tag_opened: false
            })
        }
    };

    toggleDropdown = (evt) => {
        const id = evt.target.id;
        if (id === 'notifications_wrapper') {
            this.setState({
                notification_opened: !this.state.notification_opened,
                profile_tag_opened: false,
                notifications_number: 0
            });
        } else if (id.indexOf('profile_tag') === 0) {
            if (this.state.notification_opened) {
                this.setState({
                    profile_tag_opened: !this.state.profile_tag_opened,
                    notification_opened: false
                });
            } else {
                this.setState({
                    profile_tag_opened: !this.state.profile_tag_opened,
                });
            }
        }
    };

    checkId = () => {
        if (this.props.id !== this.state.id) {
            this.props.dispatch(userInfo(this.props.id))
        }
    };

    componentDidMount() {
        this.props.dispatch(getNotifications(this.props.id));
        this.setState({
            notifications_number: this.state.notifications.length
        });
        socket.emit('createRoom', {id: this.props.id});
        socket.on('reloadNotification', () => {
            this.props.dispatch(getNotifications(this.props.id));
        });
        window.addEventListener('mousedown', this.untoggleDropdown, false);
        window.addEventListener("scroll", this.hideDropdown, false);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.untoggleDropdown);
        window.removeEventListener('scroll', this.hideDropdown);
        socket.emit('leaveRoom', {id: this.props.id});
    }

    render() {
        this.checkId();
        let profile_pic = this.state.user_img;
        return (
            <div id={'connected_options_wrapper'}>
                <Notifications opened={this.state.notification_opened} toggle={this.toggleDropdown}
                               notifications={this.state.notifications} number={this.state.notifications_number}/>
                <ProfileTag opened={this.state.profile_tag_opened}
                            user_img={profile_pic}
                            options={this.state.dropdown_content} toggle={this.toggleDropdown}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const user = state.user;
    const checkProfile = state.profile.res;
    const notifications = state.notifications.all;
    return {
        user,
        checkProfile,
        notifications
    };
}

export default connect(mapStateToProps)(HeaderConnectedOptions);