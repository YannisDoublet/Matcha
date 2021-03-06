import React from 'react'
import classnames from 'classnames'
import GeolocationInput from '../GeolocationInput'
import SearchUser from '../SearchUser'
import SubmitButton from '../SettingsBar/submit_button';
import ResetButton from "../ResetButton";
import './advanced_research.css'

const AdvancedResearch = (props) => {
    const advanced = props.advanced;
    return (
        <div id={'advanced_research_container'}>
            <div id={'advanced_research_title'} onClick={props.open}>
                <p id={'advanced_title'}>
                    Advanced research
                    <img id={'arrow-down'} src={'/assets/down-arrow.svg'} alt={'arrow-down'}/>
                </p>
            </div>
            {advanced ?
                <div id={'advanced_research_content'}
                     className={classnames('', {'active_dropdown': advanced})}>
                    <GeolocationInput updateValue={props.updateValue} path={props.path}/>
                    <SearchUser updateValue={props.updateValue}/>
                    <div id={'advanced_research_button_container'}>
                        <SubmitButton submit={props.submit}/>
                        <ResetButton reset={props.reset}/>
                    </div>
                </div> : null}
        </div>
    );
};

export default AdvancedResearch;
