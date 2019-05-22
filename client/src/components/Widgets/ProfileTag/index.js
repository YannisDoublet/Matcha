import React, {Component} from 'react'
import classnames from 'classnames'
import {Link} from 'react-router-dom'
import './profile_tag.css'

class ProfileTag extends Component {

    state = {
    };

    renderProfileTag = (options) => {
        return (
            options.map((item, i) => (
                <Link id={'profile_tag_link'} to={item.link} key={i} onClick={(evt) => this.props.toggle(evt)}>
                    <div id={'profile_tag_item'} className={'profile_tag_item'}>
                        <img src={item.img} id={'profile_tag_item_img'} className={'profile_tag_img'} alt={'profile_tag_img'}/>
                        <p id={'profile_tag_msg'} className={'profile_tag_msg'}>{item.msg}</p>
                    </div>
                </Link>
        )))
    };

    render() {
        const user = this.props.user;
        const options = this.props.options;
        const opened = this.props.opened;
        return (
            <div id={'profile_tag_wrapper'} onClick={(evt) => this.props.toggle(evt)}>
                <img id={'profile_tag_img'} src={user.img} alt={'user_img'}/>
                <div id={'profile_tag_container'}>
                    <p id={'profile_tag_greetings'}>Profile</p>
                    <img id={'profile_tag_arrow-down'} src={'/assets/down-arrow.svg'} alt={'arrow-down'}/>
                    <div id={'profile_tag_dropdown'} className={classnames('', {'show': opened})}>
                        {this.renderProfileTag(options)}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileTag;