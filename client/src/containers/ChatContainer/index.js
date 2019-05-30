import React, {Component} from 'react';
import {connect} from 'react-redux';
import ChatNavbar from '../../components/Widgets/ChatNavbar'
import ChatBox from '../../components/Widgets/ChatBox'
import './chat.css'

class Chat extends Component {

    state = {
        users: [
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                unread_msg: '5', last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                unread_msg: '5', last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                unread_msg: '5', last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                unread_msg: '5', last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
            {
                pic: '/assets/zuckywola.jpg', name: 'Mark Zuckerberg', status: 'Online', last_msg_time: '5 mins',
                unread_msg: '5', last_msg: 'Hello ! Im Mark Zuckerberg !'
            },
        ],
        active: 0
    };

    updateActive = (evt) => {
        this.setState({
            active: evt.target.closest('div#chat_card_wrapper > div').id
        });
    };

    render() {
        let users = this.state.users;
        let active = this.state.active;
        return (
            <div id={'chat_wrapper'}>
                <div id={'chat_navbar_container'}>
                    <ChatNavbar users={users} active={this.updateActive}/>
                </div>
                <div id={'chat_box_container'}>
                    <ChatBox conversation={users[active]}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Chat);