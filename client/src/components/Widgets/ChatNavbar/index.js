import React, {Component, Fragment} from 'react'
import ChatSearchbar from '../ChatSearchbar'
import ChatCard from '../ChatCard'
import './chat_navbar.css'


class ChatNavbar extends Component {

    state = {
        card: [],
        filter: [],
        value: ''
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.users) {
            this.setState({
                card: nextProps.users
            });
        }
    }

    sortMatch = (value) => {
        let card = this.state.card;
        if (card.length > 0) {
            const filteredSuggestions = card.filter(user =>
                user.firstname.indexOf(value.charAt(0).toUpperCase() + value.slice(1)) === 0);
            this.setState({
                filter: filteredSuggestions,
                value: value
            })
        } else {
            this.setState({
                filter: [],
                value: value
            })
        }
    };

    renderChatCard = (users) => {
        return users.map((user, i) => (
            <ChatCard key={i} user={user} id={i} active={this.props.active}/>
        ));
    };

    render() {
        let filter = this.state.value.length > 0 ? this.state.filter : this.state.card;
        return (
            <Fragment>
                <ChatSearchbar sort={this.sortMatch}/>
                <div id={'chat_card_wrapper'}>
                    {filter.length ? this.renderChatCard(filter) :
                        <p id={'chat_searchbar_excuse_msg'}>No conversation found...</p>}
                </div>
            </Fragment>
        );
    }
}

export default ChatNavbar;