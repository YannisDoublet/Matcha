import React, {Component} from 'react'
import ProfileTag from '../Widgets/ProfileTag'
import Notifications from '../Widgets/Notifications'
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
        user: {img: '/assets/zuckywola.jpg', firstname: 'Mark'},
        dropdown_content: [
            {img: '/assets/resume.svg', msg: 'Manage my account', link: '/manage'},
            {img: '/assets/settings-gears.svg', msg: 'Settings', link: '/settings'},
            {img: '/assests/logout.svg', msg: 'Logout', link: '/logout'},
        ],
        notification_opened: false,
        profile_tag_opened: false
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

    toggleDropdown = (evt) => {
        const id = evt.target.id;
        switch(id) {
            case('notification_wrapper'):
                this.setState({
                    notification_opened: !this.state.notification_opened,
                    profile_tag_opened: false,
                    notifications: this.state.notification_opened ? [] : this.state.notifications
                });
                break;
            case('profile_tag_wrapper'):
                this.setState({
                    profile_tag_opened: !this.state.profile_tag_opened,
                    notification_opened: false,
                    notifications: this.state.notification_opened ? [] : this.state.notifications
                });
                break;
            default:
                break;
        }
    };

    componentDidMount() {
        window.addEventListener("scroll", this.hideDropdown, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.hideDropdown);
    }

    render() {
        return (
            <div id={'connected_options_wrapper'}>
                <Notifications opened={this.state.notification_opened} toggle={this.toggleDropdown}
                notifications={this.state.notifications}/>
                <ProfileTag opened={this.state.profile_tag_opened} user={this.state.user}
                options={this.state.dropdown_content} toggle={this.toggleDropdown}/>
            </div>
        );
    }
}

export default HeaderConnectedOptions;