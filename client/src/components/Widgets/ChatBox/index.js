import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ChatBanner from '../ChatBanner'
import ChatContent from '../ChatContent'
import ChatInput from '../ChatInput'
import {fetchMsg} from "../../../actions/chatActions";
import './chatbox.css'

class ChatBox extends Component {

    state = {
        message: []
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        let content = document.querySelector('#chat_content_container');
        content.scrollTop = content.scrollHeight;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.conversation !== this.props.conversation) {
            this.props.dispatch(fetchMsg(nextProps.conversation.conv_id));
            this.props.socket.on('reloadMessage', () => {
                this.props.dispatch(fetchMsg(nextProps.conversation.conv_id));
                this.props.updateCard();
            });
        } else if (nextProps.message !== this.props.message) {
            this.setState({
                message: nextProps.message
            })
        }
    };

    render() {
        let user_info = this.props.conversation;
        let msg = this.state.message;
        let id = this.props.id;
        return (
            <Fragment>
                <ChatBanner user={user_info} toggle={this.props.toggle}/>
                <ChatContent message={msg} id={id}/>
                <ChatInput info={user_info} sender={id}/>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    let message = state.chat ? state.chat.message : null;
    return {
        message
    };
}

export default connect(mapStateToProps)(ChatBox);