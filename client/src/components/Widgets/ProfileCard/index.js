import React from 'react'
import './profile_card.css'

// import Tags from '../Tags'

const ProfileCard = (props) => {
    return (
        <div className={'card'}>
            <div id={'profile_pic'} style={{backgroundImage: "url('/assets/zuckywola.jpg')"}}/>
            <p id={'name'}>Mark Zuckerberg, 34</p>
            <p id={'username'}>Zucky47</p>
            <div id={'gender_container'}>
                <div id={'gender'}>
                    <i className="fas fa-mars" />
                    <p id={'gender_status'}>Man</p>
                </div>
                <div id={'sexuality'}>
                    <i className="fas fa-venus-mars" />
                    <p id={'orientation'}>Heterosexual</p>
                </div>
            </div>
            <div id={'infos'}>
                <div id={'location'}>
                    <i className="fas fa-map-marker-alt" />
                    <p id={'city'}>San Francisco, USA</p>
                </div>
                <div id={'popularity'}>
                    <i className="fas fa-star" />
                    <p id={'score'}>95</p>
                </div>
            </div>
            <div id={'connection_status'}>
                <p id={'status_online'}>Connected</p>
                {/*<p id={'status_offline'}>Disconnected</p>*/}
            </div>
            <div id={'interactions'}>
                {props.match.path === '/profile' && props.like_status === 0 &&
                <button id={'like_button'} onClick={props.like}>Like</button>}
                {props.match.path === '/profile' && props.like_status === 1 &&
                <button id={'unlike_button'} onClick={props.like}>Unlike</button>}
                {props.match.path === '/search' && <button id={'view_button'}>Profile</button>}
                <button id={'report'} onClick={props.report}>Report</button>
            </div>
        </div>
    );
};

export default ProfileCard;