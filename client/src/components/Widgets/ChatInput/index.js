import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sendMessage} from "../../../actions/chatActions";
import './chatInput.css'
import socketIOClient from "socket.io-client";
import {ENDPOINT} from "../../../config/socket";

const socket = socketIOClient(ENDPOINT);

class ChatInput extends Component {

    state = {
        value: ''
    };

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    };

    submitForm = (e) => {
        e.preventDefault();
        let sender = this.props.sender;
        let conv_id = this.props.info ? this.props.info.conv_id : null;
        if (this.state.value && conv_id) {
            this.props.dispatch(sendMessage(conv_id, sender.id, this.state.value))
                .then(() => {
                    socket.emit('fetchMessage', {id: conv_id});
                    socket.emit('messageNotif', {conv_id: conv_id, sender: sender.id});
                    this.setState({
                        value: ''
                    })
                })
        }
    };

    render() {
        let disabled = !this.props.info;
        return (
            <form id={'chat_input_container'} onSubmit={this.submitForm}>
                <input id={'chat_input'} type={'text'} placeholder={'Write a message...'} disabled={disabled}
                       onChange={(e) => this.handleChange(e)} value={this.state.value}/>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ChatInput);
