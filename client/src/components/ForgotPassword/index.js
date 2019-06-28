import React, {Component} from 'react'
import {connect} from 'react-redux'
import {sendForgotPassword} from '../../actions/authActions';
import './forgot_password.css'
import Alert from "../Widgets/Alert";

class ForgotPassword extends Component {

    state = {
        alert: {
            type: '',
            status: false,
            message: ''
        },
        email: ''
    };

    handleAlert = (alert) => {
        let newState = this.state;
        newState.alert.status = alert.status;
        newState.alert.type = alert.type;
        newState.alert.message = alert.message;
        this.setState({
            ...newState
        })
    };

    handleChange = (e) => {
        this.setState({
            email: e.target.value
        })
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.reset !== this.props.reset) {
            this.handleAlert(nextProps.reset);
        }
    }

    submitForm = (e) => {
        e.preventDefault();
        let {email} = this.state;

        if (email) {
            this.props.dispatch(sendForgotPassword(email));
        } else {
            this.handleAlert({type: 'error', status: true, message: 'No email provided !'})
        }
        this.setState({
            email: ''
        })
    };

    render() {
        return (
            <div id={'forgot_password_container'}>
                <Alert alert={this.state.alert} handleAlert={this.handleAlert}/>
                <form id={'forgot_password_form'} onSubmit={this.submitForm}>
                    <input type={'email'} id={'forgot_password_input'} onChange={(e) => this.handleChange(e)}
                           value={this.state.email} placeholder={'Email'} onSubmit={(e) => this.submitForm(e)}/>
                </form>
                <button id={'forgot_password_back'} onClick={(e) => this.props.toggleForgot(e)}>Back</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let reset = state.user ? state.user.res : null;
    return {
        reset
    };
}

export default connect(mapStateToProps)(ForgotPassword);
