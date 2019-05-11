import React, {Component} from 'react'

import './alert.css'

class Alert extends Component {

    closeAlert = () => {
        let alert = this.props.alert;
        alert.status = false;
        alert.type = '';
        alert.message = '';
        this.props.handleAlert(alert);
    };

    render() {
        let alert = this.props.alert;
        return (
            <div id={'alert_container'}>
                <div id={'alert_message'}>{alert.message}</div>
                <div id={'alert_close_button'} onClick={this.closeAlert}><i className="fas fa-times"/></div>
            </div>
        )
    };
};

export default Alert;