import React, {Component, Fragment} from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

/* FINIR LOGOUT ET UPDATE TIME */

class Logout extends Component {

    state = {
        redirect: false
    };

    componentDidMount() {
        let token = localStorage.getItem('T');
        this.logout(token);
        localStorage.removeItem('T');
        this.setState({
            redirect: true
        })
    }

    logout = (token) => {
        axios.post('/api/account/verify_token', {token: token})
            .then(res =>
                axios.post('/api/account/logout', {time: Date.now(), id: res.data.id})
            )
    };

    render() {
        return (
            <Fragment>
                {this.state.redirect && <Redirect to={'/'}/>}
            </Fragment>
        )
    }
}

export default Logout;
