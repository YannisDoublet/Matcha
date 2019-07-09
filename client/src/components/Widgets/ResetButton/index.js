import React from 'react'
import './reset_button.css'

const ResetButton = (props) => {
    return (
        <button id={'reset_button'} onClick={props.reset}>Reset</button>
    );
};

export default ResetButton;