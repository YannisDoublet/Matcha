import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './login.css'

import SignUpForm from './Sign_up'
import SignInForm from './Sign_in'

class Login extends Component {

    state = {
        sign_in: false,
        sign_up: true,
        error: false,
        error_value: '',
        last_clicked: 'sign_in'
    };

    toggleForms = (evt) => {
        if (evt.target.id === 'sign_in' && this.state.sign_in === false) {
            this.setState({
                sign_in: true,
                sign_up: false,
                last_clicked: evt.target.id
            })
        } else if (evt.target.id === 'sign_up' && this.state.sign_up === false) {
            this.setState({
                sign_in: false,
                sign_up: true,
                last_clicked: evt.target.id
            })
        }
    };

    errorHandler = (error) => {
        if (error) {
            this.setState({
                error: true,
                error_value: error
            });
        } else {
            this.setState({
                error: false,
                error_value: ''
            })
        }
    };

    render() {
        let active = {
            sign_in: this.state.sign_in ? 'active_button' : '',
            sign_up: this.state.sign_up ? 'active_button' : ''
        };
        return (
            <div className={'container'}>
                <div className={'login_container'}>
                    <div className={'login_nav'}>
                        <Link to={'/'}>
                            <img className={'logo2'} src={'/assets/love.svg'} alt={'Logo'}/>
                        </Link>
                        <p className={'title'}>Matcha</p>
                    </div>
                    <div className="login_content">
                        <div className="login_picture">
                            <img src={'/assets/undraw_super_thank_you_obwk.svg'} className={'picture'} alt={'Heart'}/>
                        </div>
                        <div className="login_forms">
                            {this.state.error ? <div className={'login_error'}>{this.state.error_value}</div> : null}
                            <div className="login_box">
                                <div className={'login_option'}>
                                    <div id={'sign_up'} className={`login_sign_up_button ${active.sign_up}`}
                                         onClick={this.toggleForms}>Sign up
                                    </div>
                                    <div id={'sign_in'} className={`login_sign_in_button ${active.sign_in}`}
                                         onClick={this.toggleForms}>Sign in
                                    </div>
                                </div>
                                {this.state.sign_in ? <SignInForm error={this.errorHandler}/>
                                    : <SignUpForm error={this.errorHandler}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
