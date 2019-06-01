import React, {Component} from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

/* FINIR LOGOUT ET UPDATE TIME */

class Logout extends Component {

    state = {
        redirect: false
    };

    logout = () => {
        axios.post('/api/account/verify_token', {token: localStorage.getItem('T')})
            .then(res =>
                axios.post('/api/account/logout', {time: Date.now(), id: res.data.id})
                    .then(res => {
                        localStorage.removeItem('T');
                        this.setState({
                            redirect: true
                        })
                    })
            )
    };

    render() {
        let redirect = this.state.redirect;
        this.logout();
        return (
            redirect && <Redirect to={'/'}/>
        )
    }
}

export default Logout;
