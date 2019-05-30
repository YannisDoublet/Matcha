import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ChatBanner from '../ChatBanner'
import ChatContent from '../ChatContent'
import ChatInput from '../ChatInput'
import './chatbox.css'

class ChatBox extends Component {
    render() {
        let user_info = this.props.conversation;
        return (
            <Fragment>
                <ChatBanner user={user_info} toggle={this.props.toggle}/>
                <ChatContent user={user_info} />
                <ChatInput />
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ChatBox);