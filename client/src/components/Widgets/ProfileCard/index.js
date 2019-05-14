import React from 'react'
import Tags from '../Tags'
import './profile_card.css'

const ProfileCard = (props) => {
    const user = props.users;
    const path = props.match.path;
    return (
        <div id={'card'} className={'card'}>
            <div id={'profile_pic'} style={{backgroundImage: "url('/assets/zuckywola.jpg')"}}/>
            <p id={'name'}>{user.firstname} {user.lastname}, {props.users.age}</p>
            <p id={'username'}>{user.username}</p>
            <div id={'gender_container'}>
                <div id={'gender'}>
                    <i className="fas fa-mars"/>
                    <p id={'gender_status'}>{user.gender}</p>
                </div>
                <div id={'sexuality'}>
                    <i className="fas fa-venus-mars"/>
                    <p id={'orientation'}>{user.sexuality}</p>
                </div>
            </div>
            <div id={'infos'}>
                <div id={'location'}>
                    <i className="fas fa-map-marker-alt"/>
                    <p id={'city'}>{user.location}</p>
                </div>
                <div id={'popularity'}>
                    <i className="fas fa-star"/>
                    <p id={'score'}>{user.popularity}</p>
                </div>
            </div>
            <div id={'connection_status'}>
                {user.status === 'Connected' ? <p id={'status_online'}>{user.status}</p>
                    : <p id={'status_offline'}>{user.status}</p>}
            </div>
            {path === '/match' && <Tags id={'card'} tags={user.tags}/>}
            <div id={'interactions'}>
                {path === '/profile' && props.like_status === 0 &&
                <button id={'like_button'} onClick={props.like}>Like</button>}
                {path === '/profile' && props.like_status === 1 &&
                <button id={'unlike_button'} onClick={props.like}>Unlike</button>}
                {path === '/profile' &&
                <button id={'report'} onClick={props.report}>Report</button>}
            </div>
        </div>
    );
};

export default ProfileCard;