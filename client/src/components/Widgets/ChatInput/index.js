import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sendMessage} from "../../../actions/chatActions";
import './chatInput.css'

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
        let conv_id = this.props.conv_id.msg.conv_id;
        if (this.state.value) {
            this.props.dispatch(sendMessage(conv_id, sender.id, this.state.value));
            this.setState({
                value: ''
            })
        }
    };

    render() {
        console.log('Input: ', this.props);
        return (
            <form id={'chat_input_container'} onSubmit={this.submitForm}>
                <input id={'chat_input'} type={'text'} placeholder={'Write a message...'} onChange={(e) => this.handleChange(e)} value={this.state.value}/>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ChatInput);
