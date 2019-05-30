import React, {Component} from 'react';
import {connect} from 'react-redux';
import './sign_in.css'
import {CSSTransition} from "react-transition-group";
import {loginUser} from "../../../actions/authActions";
import {Redirect} from 'react-router-dom'

class SignInForm extends Component {

    state = {
        redirect: false,
        mounted: false,
        formData: {
            email: {
                element: 'input',
                config: {
                    type: 'text',
                    name: 'email',
                    placeholder: 'Email',
                    autoComplete: 'email'
                },
                valid: '',
                touched: '',
                icon: 'fas fa-envelope',
                value: ''

            },
            password: {
                element: 'input',
                config: {
                    type: 'password',
                    name: 'password',
                    placeholder: 'Password',
                    autoComplete: 'current-password'
                },
                icon: 'fas fa-lock',
                value: ''
            }
        }
    };

    validation = (data) => {
        if (!data.email.length || !data.password.length) {
            this.props.error('Empty fields !');
            return false;
        } else {
            return true;
        }
    };

    handleChange = (evt) => {
        let newState = this.state;
        this.props.error();
        newState.formData[evt.target.name].value = evt.target.value;
        this.setState({
            ...newState
        })
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        let data = {};
        Object.keys(this.state.formData).map(key => {
            return data[key] = this.state.formData[key].value;
        });
        if (this.validation(data)) {
            this.props.dispatch(loginUser(data));
        }
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.login.res.type === 'error')
            this.props.alert(nextProps.login.res);
        else if (nextProps.login.res.success) {
            localStorage.setItem('T', nextProps.login.res.success);
            let newState = this.state;
            newState.redirect = true;
            this.setState({
                ...newState
            });
        }
    }

    componentDidMount() {
        this.setState({
            mounted: true
        })
    }

    render() {
        console.log(this.state);
        return (
            <form className={'sign_in_container'} onSubmit={this.handleSubmit}>
                {this.state.redirect && <Redirect to={'/'}/>}
                <CSSTransition timeout={950} classNames="input_container_sign_in" in={this.state.mounted}>
                    <div className={'input_container_sign_in'}>
                        <input {...this.state.formData.email.config} className={'sign_in_input'}
                               onChange={(evt) => this.handleChange(evt)}/>
                        <span className={'input_icon'}>
                            <i className={this.state.formData.email.icon}/>
                        </span>
                    </div>
                </CSSTransition>
                <CSSTransition timeout={950} classNames="input_container_sign_in" in={this.state.mounted}>
                    <div className={'input_container_sign_in'}>
                        <input {...this.state.formData.password.config} className={'sign_in_input'}
                               onChange={(evt) => this.handleChange(evt)}/>
                        <span className={'input_icon'}>
                            <i className={this.state.formData.password.icon}/>
                        </span>
                    </div>
                </CSSTransition>
                <div className={'button_container'}>
                    <CSSTransition timeout={950} classNames="sign_in_button" in={this.state.mounted}>
                        <button className={'sign_in_button'} onClick={(evt) => this.handleSubmit(evt)}>
                            Sign in
                        </button>
                    </CSSTransition>
                </div>
                <CSSTransition timeout={950} classNames="sign_in_option_text" in={this.state.mounted}>
                    <p className={'sign_in_option_text'} style={{margin: '0.5rem 0 0 0.5rem'}}>Forgot password ?</p>
                </CSSTransition>
                <CSSTransition timeout={950} classNames="line" in={this.state.mounted}>
                    <div className={'line'}/>
                </CSSTransition>
                <CSSTransition timeout={950} classNames="sign_in_option_text" in={this.state.mounted}>
                    <p className={'sign_in_option_text'} style={{marginLeft: '0.5rem'}}>Or sign in with</p>
                </CSSTransition>
                <div className={'OAUTH_container'}>
                    <CSSTransition timeout={950} classNames="OAUTH_button" in={this.state.mounted}>
                        <button className={'OAUTH_button'}>
                            <i className="fab fa-facebook-f"/>
                        </button>
                    </CSSTransition>
                    <CSSTransition timeout={950} classNames="OAUTH_button" in={this.state.mounted}>
                        <button className={'OAUTH_button'}>
                            <i className="fab fa-twitter"/>
                        </button>
                    </CSSTransition>
                    <CSSTransition timeout={950} classNames="OAUTH_button" in={this.state.mounted}>
                        <button className={'OAUTH_button'}>
                            <img src={'/assets/Google_Logo.png'} height="25" width="25" alt={'Google'}/>
                        </button>
                    </CSSTransition>
                </div>
            </form>
        );
    }
}

function mapStateToProps(state) {
    const login = state.user;
    return {
        login
    };
}

export default connect(mapStateToProps)(SignInForm);
