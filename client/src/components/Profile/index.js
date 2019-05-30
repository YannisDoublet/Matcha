import React from 'react';

import ProfileContainer from '../../containers/ProfileContainer'

const Profile = (props) => {
    console.log(props);
    return (
        <ProfileContainer {...props}/>
    );
};

export default Profile;
