import React, {Component} from 'react'
import './chat_searchbar.css'

class ChatSearchbar extends Component {

    state = {
        value: ''
    };

    handleChange = (evt) => {
        this.setState({
            value: evt.target.value
        }, () => {
            this.props.sort(this.state.value);
        })
    };

    render() {
        return (
            <form id={'chat_searchbar_container'}>
                <input id={'chat_searchbar'} type={'text'} onChange={this.handleChange}
                value={this.state.value} placeholder={'Search for conversation...'} />
            </form>
        );
    }
}

export default ChatSearchbar;