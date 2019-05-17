import React, {Component} from 'react'
import classnames from 'classnames'
import './profile_tag.css'

class ProfileTag extends Component {

    state = {
    };

    renderProfileTag = () => {

    };

    render() {
        const user = this.props.user;
        const options = this.props.options;
        return (
            <div id={'profile_tag_wrapper'} onClick={(evt) => this.props.toggle(evt)}>
                <img id={'profile_tag_img'} src={user.img}/>
                <div id={'profile_tag_menu'}>
                    <p>Hi <strong>{user.firstname}</strong></p>
                    <img id={'arrow-down'} src={'/assets/down-arrow.svg'} alt={'arrow-down'}/>
                </div>
            </div>
        );
    }
}

export default ProfileTag;