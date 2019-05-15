import React from 'react';
import SortResult from "../SortResult";
import GeolocationSlider from "../Geolocation";
import AgeSlider from "../Age_Slider";
import PopularitySlider from "../Popularity_Slider";
import './settings_bar.css'

const SettingsBar = (props) => {
    return (
        <div id={'research_container'}>
            <p id={'container_title'}>Sorted by</p>
            <SortResult updateValue={props.updateValue}/>
            <p id={'container_title'}>Filter by</p>
            <GeolocationSlider updateValue={props.updateValue}/>
            <AgeSlider updateValue={props.updateValue}/>
            <PopularitySlider updateValue={props.updateValue}/>
        </div>
    );
};

export default SettingsBar;