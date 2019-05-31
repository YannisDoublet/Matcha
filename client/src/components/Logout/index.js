import React from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

/* FINIR LOGOUT ET UPDATE TIME */

const Logout = (props) => {

    const logout = () => {
        axios.post('/api/account/logout', {time: Date.now()})
            .then(() => {
                localStorage.removeItem('T');
            })
    };

    logout();
    return (
        <Redirect to={'/'}/>
    );
};

export default Logout;
