import React from 'react'
import './submit_button.css'

const SubmitButton = (props) => {
    return (
        <button id={'submit'} onClick={props.submit}>Search</button>
    );
};

export default SubmitButton;
