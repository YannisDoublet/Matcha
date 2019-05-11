import React, {Component} from 'react';
import {connect} from 'react-redux';
import './sign_in.css'
import {CSSTransition} from "react-transition-group";

class SignUpForm extends Component {

    state = {
        mounted: false,
        error: false,
        error_message: false,
        formData: {
            user: {
                element: 'input',
                config: {
                    type: 'text',
                    name: 'user',
                    placeholder: 'Email',
                    autoComplete: 'username'
                },
                icon: 'fas fa-envelope',
                value: ''

            },
            password: {
                element: 'input',
                config: {
                    type: 'password',
                    name: 'psw',
                    placeholder: 'Password',
                    autoComplete: 'current-password'
                },
                icon: 'fas fa-lock',
                value: ''
            }
        }
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        console.log('salut');
    };

    componentDidMount() {
        this.setState({
            mounted: true
        })
    }

    render() {
        return (
            <form className={'sign_in_container'} onSubmit={this.handleSubmit}>
                <CSSTransition timeout={950} classNames="input_container_sign_in" in={this.state.mounted}>
                    <div className={'input_container_sign_in'}>
                        <input {...this.state.formData.user.config} className={'sign_in_input'}/>
                        <span className={'input_icon'}>
                            <i className={this.state.formData.user.icon}/>
                        </span>
                    </div>
                </CSSTransition>
                <CSSTransition timeout={950} classNames="input_container_sign_in" in={this.state.mounted}>
                    <div className={'input_container_sign_in'}>
                        <input {...this.state.formData.password.config} className={'sign_in_input'}/>
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
    return {};
}

export default connect(mapStateToProps)(SignUpForm);
