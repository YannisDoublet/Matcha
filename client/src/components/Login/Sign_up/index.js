import React, {Component} from 'react';
import {connect} from 'react-redux';
import { registerUser } from "../../../actions/authActions";
import SignUpStep1 from './sign_up_step_1'
import SignUpStep2 from "./sign_up_step_2";
import './sign_up.css'

// Forgot-password remaining


class SignUpForm extends Component {

    state = {
        stage: 1,
        firstname: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        },
        lastname: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        },
        age: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        },
        gender: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        },
        sexuality: {
            required: false,
            valid: null,
            touched: false,
            value: 'Bisexual'
        },
        email: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        },
        username: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        },
        password: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        },
        check_password: {
            required: true,
            valid: null,
            touched: false,
            value: ''
        }
    };

    handleStage = (stage) => {
        stage === 1 ? this.setState({stage: stage + 1}) : this.setState({stage: stage - 1});
    };

    handleChange = () => {
        let item = this.state;
        this.setState({
            ...item
        });
    };

    submitForm = (evt) => {
        evt.preventDefault();
        let user = {};
        Object.keys(this.state).map(key => {
            if (key !== 'stage') return user[key] = this.state[key].value;
            return null;
        });
        this.props.dispatch(registerUser(user));
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.props.alert(nextProps.register.res);
    }

    componentWillUnmount() {
        this.props.error();
    }

    render() {
        const stage = this.state.stage;
        return (
            <form onSubmit={this.submitForm}>
                {stage === 1 ? <SignUpStep1 data={{
                        firstname: this.state.firstname,
                        lastname: this.state.lastname,
                        age: this.state.age,
                        gender: this.state.gender,
                        sexuality: this.state.sexuality
                    }} stage={stage} change={this.handleChange} handleStage={this.handleStage} showError={this.props.error}/>
                    : <SignUpStep2 data={{
                        email: this.state.email,
                        username: this.state.username,
                        password: this.state.password,
                        check_password: this.state.check_password
                    }} stage={stage} change={this.handleChange} handleStage={this.handleStage}
                                   submit={this.submitForm} showError={this.props.error}/>}
            </form>
        );
    }
}

function mapStateToProps(state) {
    const register = state.user;
    return {
        register
    };
}

export default connect(mapStateToProps)(SignUpForm);
