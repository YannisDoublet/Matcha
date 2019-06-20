import React, {Component} from 'react'
import classnames from 'classnames'
import './settings_forms_style.css'
import Alert from "../Alert";
import GeolocationInput from "../GeolocationInput";

class SettingsForm extends Component {

    state = {
        error_left: false,
        error_right: false,
        error_message_left: '',
        error_message_right: '',
        alert : {
            type: '',
            message: ''
        },
        formData: [
            {
                element: 'input',
                position: 1,
                config: {
                    type: 'text',
                    name: 'firstname',
                    placeholder: 'Firstname',
                },
                value: ''
            },
            {
                element: 'input',
                position: 1,
                config: {
                    type: 'text',
                    name: 'lastname',
                    placeholder: 'Lastname',
                },
                value: ''
            },
            {
                element: 'input',
                position: 1,
                config: {
                    type: 'text',
                    name: 'age',
                    placeholder: 'Age',
                },
                value: ''
            },
            {
                element: 'select',
                position: 1,
                type: 'select',
                name: 'gender',
                options: [
                    'Male',
                    'Female',
                    'Undefined'
                ],
                value: ''
            },
            {
                element: 'select',
                position: 1,
                type: 'select',
                name: 'sexuality',
                options: [
                    'Bisexual',
                    'Heterosexual',
                    'Homosexual'
                ],
                value: ''
            },
            {
                element: 'input',
                position: 2,
                config: {
                    type: 'email',
                    name: 'email',
                    placeholder: 'Email'
                },
                value: ''
            },
            {
                element: 'input',
                position: 2,
                config: {
                    type: 'password',
                    name: 'password',
                    placeholder: 'Password',
                    autoComplete: 'new-password'
                },
                value: ''
            },
            {
                element: 'input',
                position: 2,
                config: {
                    type: 'password',
                    name: 'check_password',
                    placeholder: 'Repeat password',
                    autoComplete: 'new-password'
                },
                value: ''
            }
        ]
    };

    handleChange = (e, name) => {
        let newState = this.state;
        for (let i = 0; i < newState.formData.length; i++) {
            if ((newState.formData[i].element === 'input' && newState.formData[i].config.name === name)
                || (newState.formData[i].element === 'select' && newState.formData[i].name === name)) {
                newState.formData[i].value = e.target.value;
                this.setState({
                    ...newState
                })
            }
        }
    };

    updateLocation = (type, value) => {
        if (value.lat && value.lng && typeof value.lat === 'number' && typeof value.lng === 'number') {
            this.props.updateLocation(value.lat, value.lng);
            let newState = this.state;
            newState.alert.type = 'success';
            newState.alert.message = 'Location modified !';
            this.setState({
                ...newState
            })
        }
    };

    validationInput = (side, value, name) => {
        if (name === 'firstname' || name === 'lastname') {
            if (!value.match('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')) {
                this.handleError(side, 'Only alphabetical characters !', 'toggle');
                return false;
            }
        } else if (name === 'age') {
            if (!value.match('^[0-9]+$')) {
                this.handleError(side, name.charAt(0).toUpperCase() + name.slice(1)
                    + ' should only contain numbers !', 'toggle');
                return false;
            } else if (parseInt(value) < 18) {
                this.handleError(side, 'You need to be adult to register !', 'toggle');
                return false;
            } else if (parseInt(value.length) >= 3) {
                this.handleError(side, name.charAt(0).toUpperCase() + name.slice(1)
                    + ' need to be between 18 and 99 !', 'toggle');
                return false;
            }
        } else if (name === 'email') {
            if (!value.match('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$')) {
                this.handleError(side, name.charAt(0).toUpperCase() + name.slice(1)
                    + ' should be valid !', 'toggle');
                return false;
            }
        } else if (name === 'password' || name === 'check_password') {
            if (this.state.formData[this.state.formData.length - 2].value !== this.state.formData[this.state.formData.length - 1].value) {
                this.handleError(side, 'Passwords should match !', 'toggle');
                return false;
            }
        }
        return true;
    };

    handleAlert = (alert) => {
        this.setState({
            alert: alert
        })
    };

    handleError = (side, message, option) => {
        let newState = this.state;
        newState[`error_${side}`] = option === 'reset' ? false : option === 'toggle' ? true : null;
        newState[`error_message_${side}`] = message;
        this.setState({
            ...newState
        });
    };

    submitForm = (e, name) => {
        let side = e.target.closest('div').id.split('_')[2];
        if (e.target.value) {
            this.handleError(side, '', 'reset');
            if (this.validationInput(side, e.target.value, name) === true) {
                this.props.submit(name, e.target.value);
                let newState = this.state;
                for (let i = 0; i < newState.formData.length; i++) {
                    if ((newState.formData[i].element === 'input' && newState.formData[i].config.name === name)
                        || (newState.formData[i].element === 'select' && newState.formData[i].name === name)) {
                        newState.formData[i].value = '';
                        newState.alert.type = 'success';
                        newState.alert.message = `${name.charAt(0).toUpperCase() + name.slice(1)} modified !`;
                        this.setState({
                            ...newState
                        })
                    }
                }
            }
        } else {
            this.handleError(side, 'Empty field !', 'toggle');
        }
    };

    manageRenderingInputForm = (pos) => {
        let {formData} = this.state;
        return formData.map((item, i) => {
            if (item.position === pos)
                return (this.renderInputForm(item, i));
            else
                return null;
        })
    };

    renderInputForm = (item, i) => {
        let inputTemplate = null;
        switch (item.element) {
            case 'input':
                inputTemplate = (
                    <input key={i} {...item.config} value={item.value} className={'settings_form_input'}
                           onChange={(e) => this.handleChange(e, item.config.name)}
                           onBlur={(e) => this.submitForm(e, item.config.name)}/>
                );
                break;
            case 'select':
                inputTemplate = (
                    <select key={i} id={item.name} className={'settings_form_select'}
                            onChange={(evt) => this.handleChange(evt, item.name)}
                            onBlur={(e) => this.submitForm(e, item.name)}>
                        <option hidden>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</option>
                        {item.options ? item.options.map((item, i) => (
                            <option key={i}>{item}</option>
                        )) : null}
                    </select>
                );
                break;
            default:
                inputTemplate = null;
        }
        return inputTemplate;
    };

    render() {
        return (
            <div id={'settings_forms_container'}>
                <Alert alert={this.state.alert} handleAlert={this.handleAlert}/>
                <div id={'settings_forms_left_side'}>
                    <div id={'error_left'} className={classnames('error_message', {visible: this.state.error_left})}>
                        <p>{this.state.error_message_left}</p>
                    </div>
                    <p id={'left_title'}>Personnal informations</p>
                    {this.manageRenderingInputForm(1)}
                    <div id={'settings_form_geolocation_container'}>
                        <GeolocationInput updateValue={this.updateLocation} path={this.props.path}/>
                    </div>
                </div>
                <div id={'settings_forms_right_side'}>
                    <div id={'error_right'} className={classnames('error_message', {visible: this.state.error_right})}>
                        <p>{this.state.error_message_right}</p>
                    </div>
                    <p id={'right_title'}>Connection informations</p>
                    {this.manageRenderingInputForm(2)}
                </div>
            </div>
        );
    }
}

export default SettingsForm;