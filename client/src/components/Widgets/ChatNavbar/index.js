import React, {Component, Fragment} from 'react'
import ChatSearchbar from '../ChatSearchbar'
import ChatCard from '../ChatCard'
import './chat_navbar.css'


class ChatNavbar extends Component {

    sortMatch = () => {

    };

    renderChatCard = (users) => {
        return users.map((user, i) => (
            <ChatCard key={i} user={user} id={i} active={this.props.active}/>
        ));
    };

    render() {
        let users = this.props.users;
        return (
            <Fragment>
                <ChatSearchbar sort={this.sortMatch}/>
                <div id={'chat_card_wrapper'}>
                    {this.renderChatCard(users)}
                </div>
            </Fragment>
        );
    }
}

export default ChatNavbar;