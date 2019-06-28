import React, {Component} from 'react'
import classnames from 'classnames'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {resetPassword} from '../../actions/authActions'
import './reset_password.css'
import Alert from "../Widgets/Alert";

class ResetPassword extends Component {

    state = {
        alert: {
            type: '',
            status: false,
            message: ''
        },
        redirect: false,
        password: '',
        check: '',
        display: false,
        valid_length: false,
        valid_capital: false,
        valid_number: false,
        valid_special: false
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.reset_status !== this.props.reset_status) {
            if (nextProps.reset_status.type !== 'redirect') {
                this.handleAlert(nextProps.reset_status);
            } else {
                this.setState({
                    redirect: true
                })
            }
        }
    }

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
        let newState = this.state;
        newState[e.target.id] = e.target.value;
        newState.valid_length = newState[e.target.id].length >= 8;
        newState.valid_capital = !!/[A-Z]+/.test(newState[e.target.id]);
        newState.valid_number = !!/[0-9]+/.test(newState[e.target.id]);
        newState.valid_special = !!/[!@#$%^&*(),.?":{}|<>]+/.test(newState[e.target.id]);
        this.setState({
            ...newState
        })
    };

    toggleInfo = () => {
      this.setState({
          display: !this.state.display
      })
    };

    submitForm = (e) => {
        e.preventDefault();
        let {password, check, valid_length, valid_capital, valid_number, valid_special} = this.state;
        if (valid_length && valid_capital && valid_number && valid_special && password.length && check.length
            && password === check) {
            this.props.dispatch(resetPassword(password, this.props.match.params.code));
        } else {
            this.handleAlert({status: true, type: 'error', message: 'Invalid passwords provided !'})
        }
    };

    render() {
        return (
            <div id={'reset_wrapper'}>
                <Alert alert={this.state.alert} handleAlert={this.handleAlert}/>
                {this.state.redirect && <Redirect to={'/register'} />}
                <div id={'reset_container'}>
                    <p id={'reset_header'}>Reset your password</p>
                    <form id={'reset_form'} onSubmit={(e) => this.submitForm(e)}>
                        <input id={'password'} className={'reset_input'} type={'password'}
                               onChange={(e) => this.handleChange(e)} onClick={this.toggleInfo} onBlur={this.toggleInfo}
                               placeholder={'New password'}/>
                        <div id={'instructions_container'} className={classnames('', {display: this.state.display})}>
                            <p className={classnames('', {valid: this.state.valid_length})}>
                                <i className={'fas fa-check'} />8 characters long minimum</p>
                            <p className={classnames('', {valid: this.state.valid_capital})}>
                                <i className={'fas fa-check'} />Contain a capital letter</p>
                            <p className={classnames('', {valid: this.state.valid_number})}>
                                <i className={'fas fa-check'} />Contain a number</p>
                            <p className={classnames('', {valid: this.state.valid_special})}>
                                <i className={'fas fa-check'} />Contain a special character</p>
                        </div>
                        <input id={'check'} className={'reset_input'} type={'password'}
                               onChange={(e) => this.handleChange(e)} placeholder={'New password again'}/>
                        <button id={'reset_button'}>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let reset_status = state.user.res;
    return {
        reset_status
    };
}

export default connect(mapStateToProps)(ResetPassword);