import React, {Component} from 'react';
import {connect} from 'react-redux';
import {CSSTransition} from 'react-transition-group';
import './sign_up.css'

// Faire le Forgot password etc

class SignUpStep2 extends Component {

    state = {
        mounted: false,
        error: false,
        error_message: false,
        formData: {
            email: {
                element: 'input',
                config: {
                    type: 'email',
                    name: 'email',
                    placeholder: 'Email'
                },
                icon: 'fas fa-envelope'
            },
            username: {
                element: 'input',
                config: {
                    type: 'text',
                    name: 'username',
                    placeholder: 'Username',
                    autoComplete: 'username'
                },
                icon: 'fas fa-user'
            },
            password: {
                element: 'input',
                config: {
                    type: 'password',
                    name: 'password',
                    placeholder: 'Password',
                    autoComplete: 'new-password'
                },
                icon: 'fas fa-lock'
            },
            check_password: {
                element: 'input',
                config: {
                    type: 'password',
                    name: 'check_password',
                    placeholder: 'Repeat password',
                    autoComplete: 'new-password'

                },
                icon: 'fas fa-lock'
            }
        }
    };

    isDisabled = (data) => {
        const item = Object.keys(data).map(key => data[key]);
        for (let i = 0; i < item.length; i++) {
            if (!item[i].value) {
                break;
            } else if (i + 1 === parseInt(item.length)) {
                if (this.state.error_message && this.state.error) {
                    break ;
                } else {
                    return false;
                }
            }
        }
        return true;
    };

    fetchInput = (data) => {
        const formArray = Object.keys(this.state.formData).map(key => this.state.formData[key]);
        const dataSettings = Object.keys(data).map(key => data[key]);
        return formArray.map((item, i) => {
            return (
                this.renderInput(item, dataSettings[i], i)
            );
        });
    };

    errorStateHandler = (status) => {
        status ? this.setState({
                error_message: true,
                error: true
            })
            : this.setState({
                error_message: false,
                error: false
            })
    };

    validation = (newState, name) => {
        if (name === 'email') {
            if (parseInt(newState[name].value.length) === 0) {
                newState[name].valid = false;
                this.props.showError(name.charAt(0).toUpperCase() + name.slice(1) + ' should not be empty !');
                this.errorStateHandler(true);
            } else if (!newState[name].value.match('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$')) {
                newState[name].valid = false;
                this.props.showError(name.charAt(0).toUpperCase() + name.slice(1) + ' should be valid !');
                this.errorStateHandler(true);
            } else {
                this.props.showError();
                newState[name].valid = true;
                this.errorStateHandler(false);
            }
        } else if (name === 'username') {
            if (parseInt(newState[name].value.length) === 0) {
                newState[name].valid = false;
                this.props.showError(name.charAt(0).toUpperCase() + name.slice(1) + ' should not be empty !');
                this.errorStateHandler(true);
            } else {
                this.props.showError();
                newState[name].valid = true;
                this.errorStateHandler(false);
            }
        } else if (name === 'password') {
            if (parseInt(newState[name].value.length) === 0) {
                newState[name].valid = false;
                this.props.showError(name.charAt(0).toUpperCase() + name.slice(1) + ' should not be empty !');
                this.errorStateHandler(true);
            } else {
                this.props.showError();
                newState[name].valid = true;
                this.errorStateHandler(false);
            }
        } else if (name === 'check_password') {
            if (parseInt(newState[name].value.length) === 0) {
                newState[name].valid = false;
                this.props.showError(name.charAt(0).toUpperCase() + name.slice(1) + ' should not be empty !');
                this.errorStateHandler(true);
            } else if (newState[name].value !== newState['password'].value) {
                newState[name].valid = false;
                this.props.showError('Passwords doesn\'t match !');
                this.errorStateHandler(true);
            } else {
                this.props.showError();
                newState[name].valid = true;
                this.errorStateHandler(false);
            }
        }
        this.props.change();
    };

    handleChange = (evt, name) => {
        let newState = this.props.data;
        newState[name].value = evt.target.value;
        newState[name].touched = true;
        this.validation(newState, name);
    };

    renderInput = (input, settings, i) => {
        let inputTemplate = null;
        const input_classes = [
            'sign_up_input',
            settings.touched && (settings.valid ? 'valid_input' : 'error_input')
        ].filter(v => !!v).join(' ');
        const icon_classes = [
            'input_icon',
            settings.touched && (settings.valid ? 'valid_icon' : 'error_icon')
        ].filter(v => !!v).join(' ');
        switch (input.element) {
            case('input'):
                inputTemplate = (
                    <CSSTransition key={i} timeout={950} classNames="input_container" in={this.state.mounted}>
                        <div className={'input_container'}>
                            <input {...input.config} value={settings.value}
                                   className={input_classes}
                                   onChange={(evt) => this.handleChange(evt, input.config.name)}/>
                            <span className={icon_classes}>
                            <i className={input.icon}/>
                        </span>
                        </div>
                    </CSSTransition>
                );
                break;
            default:
                inputTemplate = null;
                break;
        }
        return inputTemplate;
    };

    componentDidMount() {
        this.setState({
            mounted: true
        })
    }

    render() {
        const settings = this.props;
        return (
            <div className={'sign_up_container'}>
                {this.fetchInput(settings.data)}
                <div className={'button_container'}>
                    <CSSTransition timeout={950} classNames="sign_up_button" in={this.state.mounted}>
                        <button className={'sign_up_button'}
                                onClick={() => this.props.handleStage(settings.stage)}
                                /*disabled={this.isDisabled(settings.data) ? 'disabled' : ''}*/>
                            Back
                        </button>
                    </CSSTransition>
                    <CSSTransition timeout={950} classNames="sign_up_button" in={this.state.mounted}>
                        <button className={'sign_up_button'}
                                onClick={(evt) => this.props.submit(evt)}
                                disabled={this.isDisabled(settings.data) ? 'disabled' : ''}>
                            Submit
                        </button>
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(SignUpStep2);

