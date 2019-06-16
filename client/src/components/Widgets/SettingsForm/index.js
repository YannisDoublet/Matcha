import React, {Component} from 'react'
import './settings_forms_style.css'

class SettingsForm extends Component {

    state = {
        error: false,
        error_message: false,
            formData: {
                firstname: {
                    element: 'input',
                    position: 1,
                    config: {
                        type: 'text',
                        name: 'firstname',
                        placeholder: 'Firstname',
                    },
                    icon: 'fas fa-id-badge'
                },
                lastname: {
                    element: 'input',
                    position: 1,
                    config: {
                        type: 'text',
                        name: 'lastname',
                        placeholder: 'Lastname',
                    },
                    icon: 'fas fa-id-badge'
                },
                age: {
                    element: 'input',
                    position: 1,
                    config: {
                        type: 'text',
                        name: 'age',
                        placeholder: 'Age',
                    },
                    icon: 'fas fa-birthday-cake'
                },
                gender: {
                    element: 'select',
                    position: 1,
                    type: 'select',
                    name: 'gender',
                    options: [
                        'Male',
                        'Female',
                        'Undefined'
                    ],
                },
                sexuality: {
                    element: 'select',
                    position: 1,
                    type: 'select',
                    name: 'sexuality',
                    options: [
                        'Bisexual',
                        'Heterosexual',
                        'Homosexual'
                    ]
                },
                email: {
                    element: 'input',
                    position: 2,
                    config: {
                        type: 'email',
                        name: 'email',
                        placeholder: 'Email'
                    },
                    icon: 'fas fa-envelope'
                },
                password: {
                    element: 'input',
                    position: 2,
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
                    position: 2,
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

    render() {
        return (
            <div id={'settings_forms_container'}>
                <div id={'settings_forms_left_side'}>
                    <p>Personnal_informations</p>
                </div>
                <div id={'settings_forms_right_side'}>
                    <p>Connection_informations</p>
                </div>
            </div>
        );
    }
}

export default SettingsForm;