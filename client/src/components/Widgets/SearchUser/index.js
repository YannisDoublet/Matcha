import React, {Component} from 'react'
import './search_user.css'


class SearchUser extends Component {

    state = {
        result: [],
        users: [
            'Arnaud',
            'Shana',
            'Florent',
            'Tanguy',
            'Julien',
            'Andreas',
            'William',
            'Timothé',
            'Nicolas',
            'Thibaut'
        ],
        value: ''
    };

    handleInput = (evt) => {
      this.setState({
          value: evt.target.value
      }, () => {
          this.searchUser(this.state.value, this.state.users);
      })
    };

    searchUser = (value, user) => {
        if (value.length > 0) {
            const filteredUser = user.filter(suggestion =>
                suggestion.indexOf(value.charAt(0).toUpperCase() + value.slice(1)) === 0);
            this.setState({
                users: filteredUser
            })
        } else {
            this.setState({
                users: []
            })
        }
    };

    render() {
        console.log(this.state);
        return (
            <div id={'search_user_container'}>
                <i className="fas fa-user" />
                <input id={'search_user_input'} type={'text'} placeholder={'Search a user'}
                onChange={(evt) => this.handleInput(evt)}/>
            </div>
        );
    }
}

export default SearchUser;