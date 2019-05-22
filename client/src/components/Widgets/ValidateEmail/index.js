import React, {Component} from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

class ValidateEmail extends Component {

    state = {
        next: false,
        alert: {
            status: false,
            type: '',
            message: ''
        },
    };

    componentWillMount() {
        axios.get(`/api/account/validate?token=${this.props.match.params.token}`)
            .then(res => {
                let newState = this.state;
                newState.next = true;
                newState.alert.status = res.data.status;
                newState.alert.type = res.data.type;
                newState.alert.message = res.data.message;
                this.setState({
                    ...newState
                })
            })
    }

    render() {
        let next = this.state.next;
        return (
            <div>
                {next && <Redirect to={{
                    pathname: '/register',
                    state: {validateAlert: this.state.alert}}}
                />}
            </div>

        )
    }
}

export default ValidateEmail;