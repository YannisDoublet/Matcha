import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames'
import ChatNavbar from '../../components/Widgets/ChatNavbar'
import ChatBox from '../../components/Widgets/ChatBox'
import './chat.css'

class Chat extends Component {

    state = {
        users: [
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
        ],
        active: 0,
        sidebar: true
    };

    toggleSidebar = (evt) => {
        this.setState({
            sidebar: !this.state.sidebar
        })
    };

    updateActive = (evt) => {
        this.setState({
            active: evt.target.closest('div#chat_card_wrapper > div').id,
            sidebar: false
        });
    };

    render() {
        let users = this.state.users;
        let active = this.state.active;
        let sidebar = this.state.sidebar;
        return (
            <div id={'chat_wrapper'}>
                <div className={classnames('chat_navbar_container', {'hidden': !sidebar})}>
                    <ChatNavbar users={users} active={this.updateActive}/>
                </div>
                <div id={'chat_box_container'}>
                    <ChatBox conversation={users[active]} toggle={this.toggleSidebar}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Chat);