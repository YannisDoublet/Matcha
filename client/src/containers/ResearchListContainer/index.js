import React from 'react'
import './research_list.css'
import ProfileCard from '../../components/Widgets/ProfileCard';

const ResearchList = (props) => {
    const renderResearch = (users) => {
        return (
            users.map((user, i) => (
                <ProfileCard users={user} key={i} research={true}/>
            ))
        )
    };
    const users = props.users;
    return (
        <div id={'research_list_container'}>
            {users.length > 0 ? renderResearch(users) : <p>Search</p>}
        </div>
    );
}

export default ResearchList;
