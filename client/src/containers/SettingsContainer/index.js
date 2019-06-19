import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {verifyToken} from '../../actions/authActions'
import {changeInfo, updateLocation} from '../../actions/profileActions'
import SettingsForm from '../../components/Widgets/SettingsForm'
import './settings_style.css'

class Settings extends Component {

    state = {
        redirect: false,
        authorized: true
    };

    componentWillMount() {
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!nextProps.token) {
            this.setState({
                redirect: true
            })
        } else if (nextProps.token && nextProps.logged) {
            if (nextProps.logged.username !== this.props.match.params.id) {
                this.setState({
                    authorized: false
                })
            }
        }
    }

    updateLocation = (lat, lng) => {
        this.props.dispatch(updateLocation(this.props.token.id, lat, lng));
    };

    submitForm = (name, value) => {
        this.props.dispatch(changeInfo(this.props.token.id, name, value))
    };

    render() {
        let {authorized} = this.state;
        return (
            authorized ?
                <div id={'settings_wrapper'}>
                    <SettingsForm token={this.props.token} submit={this.submitForm} updateLocation={this.updateLocation}/>
                </div>
                : <Redirect to={'/'}/>
        );
    }
}

function mapStateToProps(state) {
    let logged = state.user.info;
    let token = state.user.res ? state.user.res : null;
    return {
        logged,
        token
    };
}

export default connect(mapStateToProps)(Settings);