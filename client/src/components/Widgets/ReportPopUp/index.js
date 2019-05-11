import React, {Component} from 'react'
import {connect} from 'react-redux'

import './report.css'

class ReportPopUp extends Component {

    state = {
        report: true,
        block: false,
        error: '',
        report_select: {
            placeholder: 'Select your category',
            options: [
                'Harassment',
                'Fake account',
                'Spam',
                'Hacked'
            ],
            value: ''
        },
        report_message: {
            placeholder: 'Enter your complain here...',
            value: ''
        }
    };

    toggleSection = (evt) => {
        if (evt.target.id === 'popUp_report' && this.state.report === false) {
            this.setState({
                report: true,
                block: false,
                last_clicked: evt.target.id
            })
        } else if (evt.target.id === 'popUp_block' && this.state.block === false) {
            this.setState({
                report: false,
                block: true,
                last_clicked: evt.target.id
            })
        }
    };

    handleChange = (evt) => {
        let id = evt.target.id;
        let newState = this.state;
        newState[id].value = evt.target.value;
        if (newState.report_select.value) {
            newState.error = '';
        }
        this.setState({
            ...newState
        })
    };

    blockUser = (evt) => {
        evt.preventDefault();
        let alert = this.props.alert;
        alert.status = true;
        alert.type = 'success';
        alert.message = 'User successfully blocked !';
        this.props.handleAlert(alert);
        this.props.closePopUp();
    };

    submitForm = (evt) => {
        evt.preventDefault();
        let newState = this.state;
        if (!this.state.report_select.value) {
            newState.error = 'You must select a category !';
            this.setState({
                ...newState,
            })
        } else {
            let alert = this.props.alert;
            alert.status = true;
            alert.type = 'success';
            alert.message = 'User successfully reported !';
            this.props.handleAlert(alert);
            this.props.closePopUp();
        }
    };

    render() {
        let active = {
            report: this.state.report ? 'active' : '',
            block: this.state.block ? 'active' : ''
        };
        let select = this.state.report_select;
        let textarea = this.state.report_message;
        return (
            <div id={'popUp_container'}>
                <div id={'popUp_box'}>
                    <div id={'popUp_choice'}>
                        <div id={'popUp_report'} className={active.report}
                             onClick={this.toggleSection}>REPORT
                        </div>
                        <div id={'popUp_block'} className={active.block}
                             onClick={this.toggleSection}>BLOCK
                        </div>
                    </div>
                    {this.state.report &&
                    <form id={'report_container'} onSubmit={this.submitForm}>
                        <select id={'report_select'} onChange={(evt) => this.handleChange(evt)}>
                            <option hidden>{select.placeholder}</option>
                            {select.options ? select.options.map((item, i) => (
                                <option key={i}>{item}</option>
                            )) : null}
                        </select>
                        {this.state.error &&
                        <div id={'select_error'}>
                            <p id={'error_message'}>{this.state.error}</p>
                        </div>}
                        <textarea id={'report_message'} placeholder={textarea.placeholder}
                                  onChange={(evt) => this.handleChange(evt)}/>
                        <button id='report_button' onClick={(evt) => this.submitForm(evt)}>Report</button>
                    </form>}
                    {this.state.block &&
                    <form id={'block_container'} onSubmit={this.blockUser}>
                        <p id={'block_warning'}>Block this user to hide all interaction between you and him. This action
                            can be reverted.</p>
                        <button id={'block_button'} onClick={(evt) => this.blockUser(evt)}>BLOCK</button>
                    </form>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ReportPopUp);