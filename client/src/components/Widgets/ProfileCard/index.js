import React, {Component} from 'react'
import Tags from '../Tags'
import moment from 'moment'
import {Link} from 'react-router-dom'
import {GoogleApiKey} from '../../../config/apiKey'
import Geocode from 'react-geocode'
import './profile_card.css'

class ProfileCard extends Component {

    state = {
        location: ''
    };

    getLocation = (lat, lon) => {
        if (lat && lon) {
            Geocode.fromLatLng(lat, lon).then(res => {
                if (res.plus_code.compound_code) {
                    this.setState({
                        location: res.plus_code.compound_code.split(' ').slice(1).join(' ')
                    });
                } else {
                    this.setState({
                        location: 'France'
                    })
                }
            });
        } else {
            return null;
        }
    };

    getConnectionStatus = (connection) => {
        switch(connection) {
            case 'Connected':
                return (<p id={'status_online'}>{connection}</p>);
            case 'Never connected...':
                return (<p id={'status_offline'}>{connection}</p>);
            default:
                return(<p id={'status_offline'}>Disconnected {moment(parseInt(connection)).fromNow()}</p>)
        }
    };

    componentDidMount() {
        Geocode.setApiKey(GoogleApiKey);
        this.getLocation(this.props.user.latitude, this.props.user.longitude);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.user.latitude !== this.props.user.latitude
            && nextProps.user.longitude !== this.props.user.longitude) {
            this.getLocation(nextProps.user.latitude, nextProps.user.longitude);
        }
    }

    render () {
        let user = this.props.user;
        const path = this.props.match ? this.props.match.path : null;
        let research = this.props.research ? this.props.research : null;
        return (
            <div id={'card'} className={'card'}>
                <div id={'profile_pic'} style={{backgroundImage: `url(${user.pictures[0].picture})`}} />
                <p id={'name'}>{user.firstname} {user.lastname}, {user.age}</p>
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
                        {path === '/profile/:id' ? <p id={'city'}>{this.state.location}</p> :
                            <p id={'city'}>{parseInt(user.dist)} km</p>}
                    </div>
                    <div id={'popularity'}>
                        <i className="fas fa-star"/>
                        <p id={'score'}>{user.score}</p>
                    </div>
                </div>
                <div id={'connection_status'}>
                    {this.getConnectionStatus(user.connection)}
                </div>
                {path === '/match' && <Tags id={'card'} tags={user.tag}/>}
                <div id={'interactions'}>
                    {path === '/profile/:id' && this.props.like_status === 0 && this.props.myProfile === false &&
                    <button id={'like_button'} onClick={this.props.like}>Like</button>}
                    {path === '/profile/:id' && this.props.like_status === 0 && this.props.myProfile === true &&
                    <Link to={'/settings'}>
                        <button id={'settings_button'}>Settings</button>
                    </Link>}
                    {path === '/profile/:id' && this.props.like_status === 1 && this.props.myProfile === false &&
                    <button id={'unlike_button'} onClick={this.props.like}>Unlike</button>}
                    {path === '/profile/:id' && this.props.myProfile === false &&
                    <button id={'report'} onClick={this.props.report}>Report</button>}
                    {research &&
                    <Link to={`/profile/${user.username}`}>
                        <button id={'profile_button'}>Profile</button>
                    </Link>}
                </div>
            </div>
        )
    };
};

export default ProfileCard;