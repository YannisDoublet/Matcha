import React from 'react'
import './research_list.css'
import ProfileCard from '../../components/Widgets/ProfileCard'

const ResearchList = (props) => {
    const renderResearch = (users) => {
        return (
            users.map((user, i) => (
                <ProfileCard user={user} key={i} research={props.research} match={props.match}/>
            ))
        )
    };

    const users = props.users;
    return (
        <div id={'research_list_container'}>
            {users.length > 0 ? renderResearch(users) :
                <div id={'excuse_message'}>
                    <div id={'pulse'}>
                        <i id='marker' className="fas fa-map-marker-alt"/>
                    </div>
                    <p id={'message'}>No users in your criteria...</p>
                </div>}
        </div>
    );
};

export default ResearchList;
