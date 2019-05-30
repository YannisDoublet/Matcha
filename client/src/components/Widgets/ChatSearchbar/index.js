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
        console.log(this.state.value);
        return (
            <form id={'chat_searchbar_container'}>
                <i id={'loupe'} className="fas fa-search"/>
                <input id={'chat_searchbar'} type={'text'} onChange={this.handleChange}
                value={this.state.value} placeholder={'Search for conversation...'}/>
            </form>
        );
    }
}

export default ChatSearchbar;