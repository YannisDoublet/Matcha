import React from 'react'
import './advanced_research.css'
import classnames from "classnames"
import GeolocationInput from "../GeolocationInput"
import SearchUser from "../SearchUser"

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
            <div id={'advanced_research_content'}
                 className={classnames('', {'active_dropdown': advanced})}>
                <GeolocationInput updateValue={props.updateValue}/>
                <SearchUser updateValue={props.updateValue}/>
            </div>
        </div>
    );
};

export default AdvancedResearch;
