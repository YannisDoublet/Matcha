import React, {Component} from 'react'
import './search_user.css'


class SearchUser extends Component {

    state = {
        value: ''
    };

    handleInput = (evt) => {
      this.setState({
          value: evt.target.value
      }, () => {
          this.props.updateValue('Advanced_search', this.state.value);
      })
    };

    render() {
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