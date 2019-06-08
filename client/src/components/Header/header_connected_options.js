import React, {Component} from 'react'
import {connect} from 'react-redux'
import ProfileTag from '../Widgets/ProfileTag'
import Notifications from '../Widgets/Notifications'
import {userInfo} from "../../actions/authActions";
import './header_connected_options.css'

class HeaderConnectedOptions extends Component {
    state = {
        notifications: [
            {type: 'like', img: '/assets/heart.svg', msg: 'Someone like your profile !'},
            {type: 'visit', img: '/assets/mask.svg', msg: 'Someone visit your profile !'},
            {type: 'message', img: '/assets/love.svg', msg: 'You\'ve got a message !'},
            {type: 'match', img: '/assets/match.svg', msg: 'Congratulation ! It\'s a match !'},
            {type: 'dislike', img: '/assets/broken-heart.svg', msg: 'Someone dislike your profile !'}
        ],
        user_img: '',
        dropdown_content: [
            {img: '/assets/resume.svg', msg: 'My profile page', link: ''},
            {img: '/assets/settings-gears.svg', msg: 'Settings', link: '/settings'},
            {img: '/assets/logout.svg', msg: 'Logout', link: '/logout'},
        ],
        notifications_number: 0,
        notification_opened: false,
        profile_tag_opened: false
    };

    componentWillMount() {
        this.props.dispatch(userInfo(this.props.id));
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.user.info) {
            let newState = this.state;
            newState.user_img = nextProps.user.info.pictures[0].picture;
            newState.dropdown_content[0].link = `/profile/${nextProps.user.info.username}`;
            this.setState({
                ...newState
            });
        }
    }

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

    componentDidMount() {
            this.setState({
                notifications_number: this.state.notifications.length
            });
            window.addEventListener('mousedown', this.untoggleDropdown, false);
            window.addEventListener("scroll", this.hideDropdown, false);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.untoggleDropdown);
        window.removeEventListener('scroll', this.hideDropdown);
    }

    render() {
        return (
            <div id={'connected_options_wrapper'}>
                <Notifications opened={this.state.notification_opened} toggle={this.toggleDropdown}
                               notifications={this.state.notifications} number={this.state.notifications_number}/>
                <ProfileTag opened={this.state.profile_tag_opened} user_img={this.state.user_img}
                            options={this.state.dropdown_content} toggle={this.toggleDropdown}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const user = state.user;
    return {
        user
    };
}

export default connect(mapStateToProps)(HeaderConnectedOptions);