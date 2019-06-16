import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {verifyToken} from '../../actions/authActions'
import SettingsForm from '../../components/Widgets/SettingsForm'
import './settings_style.css'

class Settings extends Component {

    state = {
        authorized: true
    };

    componentWillMount() {
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.token && nextProps.logged) {
            if (nextProps.logged.username !== this.props.match.params.id) {
                this.setState({
                    authorized: false
                })
            }
        }
    }

    render() {
        let {authorized} = this.state;
        return (
            authorized ?
                <div id={'settings_wrapper'}>
                    <SettingsForm />
                </div>
                : <Redirect to={'/'}/>
        );
    }
}

function mapStateToProps(state) {
    let logged = state.user.info;
    let token = state.user.res;
    return {
        logged,
        token
    };
}

export default connect(mapStateToProps)(Settings);