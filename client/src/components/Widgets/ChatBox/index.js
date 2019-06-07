import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ChatBanner from '../ChatBanner'
import ChatContent from '../ChatContent'
import ChatInput from '../ChatInput'
import {fetchMsg} from "../../../actions/chatActions";
import './chatbox.css'

class ChatBox extends Component {

    state = {
        message: [],
        fetch: false
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.conversation && !this.state.fetch) {
            this.props.dispatch(fetchMsg(nextProps.conversation.msg.conv_id));
            this.setState({
                fetch: true
            })
        } else if (nextProps.message) {
            this.setState({
                message: nextProps.message,
                fetch: false
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
                <ChatInput conv_id={user_info} sender={id}/>
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