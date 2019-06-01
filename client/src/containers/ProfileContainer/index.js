import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {fetchUserByUsername} from "../../actions/profileActions";
import {userInfo, verifyToken} from "../../actions/authActions";
import GoogleMaps from '../../components/GoogleMaps'
import Alert from '../../components/Widgets/Alert'
import ReportPopUp from '../../components/Widgets/ReportPopUp'
import ProfileCard from '../../components/Widgets/ProfileCard'
import Tags from '../../components/Widgets/Tags'
import './profile_container.css'

class ProfileContainer extends Component {

    state = {
        myProfile: false,
        myProfileCheck: true,
        firstCheck: true,
        alert: {
            status: false,
            type: '',
            message: ''
        },
        like: 0,
        popUp: 0,
        tags: [
            'Funny',
            'Facebook',
            'Start-up',
            'Sylicon Valley',
            'Funny',
            'Facebook',
            'Start-up'
        ],
        gallery: [
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg'
        ]
    };

    componentWillMount() {
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
        if (this.props.match.params.id) {
            this.props.dispatch(fetchUserByUsername(this.props.match.params.id));
        }
    }

    checkMyProfile = (logged, user) => {
        this.setState({
            myProfileCheck: false,
            myProfile: logged.username === user.username
        })
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.props.profile && this.props.logged && this.state.myProfileCheck) {
            this.checkMyProfile(this.props.logged, this.props.profile.res);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.props.dispatch(fetchUserByUsername(nextProps.match.params.id));
            this.setState({
                myProfileCheck: true
            })
        } else if (nextProps.id && this.state.firstCheck) {
            this.props.dispatch(userInfo(nextProps.id.id));
            this.setState({
                firstCheck: false
            })
        }
    }

    closePopUp = () => {
        this.setState({
            popUp: 0
        });
    };

    handleAlert = (alert) => {
        let newState = this.state;
        newState.alert.status = alert.status;
        newState.alert.type = alert.type;
        newState.alert.message = alert.message;
        this.setState({
            ...newState
        })
    };

    like = () => {
        this.state.like ? this.setState({
            like: 0
        }) : this.setState({
            like: 1
        })
    };

    showReport = () => {
        this.state.popUp ? this.setState({
            popUp: 0
        }) : this.setState({
            popUp: 1
        })
    };

    renderGallery = (pictures) => {
        return pictures.map((pic, i) => (
            <div key={i} className={'gallery_picture'} style={{backgroundImage: `url('${pic}')`}}/>
        ));
    };

    render() {
        let alert = this.state.alert;
        let popUp = this.state.popUp;
        let user = this.props.profile.res;
        return (
            <div id={'profile'}>
                <Alert alert={alert} handleAlert={this.handleAlert}/>
                {popUp ? <ReportPopUp popUp={this.showReport} alert={alert}
                                      handleAlert={this.handleAlert} closePopUp={this.closePopUp}/>
                    : null}
                {user &&
                <Fragment>
                    <div id={'banner_pic_container'} style={{backgroundImage: `url(${user.banner_pic})`}}/>
                    <div id={'profile_content_container'}>
                        <ProfileCard {...this.props} like={this.like} like_status={this.state.like}
                                     report={this.showReport} popUp_status={this.state.popUp}
                                     user={user} myProfile={this.state.myProfile}/>
                        <div id={'profile_content'}>
                            <div id={'bio_container'}>
                                <p id={'bio_title'}>Biography</p>
                                <p id={'bio_content'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Quisque elit
                                    metus, sollicitudin vel nibhas a, imperdiet porta lacus. Ut aliquam scelerisque
                                    leo
                                    vitae commodo. Morbi mi libero, semper non dictum sed, bibendum vel lectus. Ut
                                    scelerisque nisl id bibendum maximus. Pellentesque eleifend ipsum a ipsum
                                    fermentum
                                    blandit. Nunc ac ligula in nunc dapibus rhoncus ac quis mauris. Cras feugiat
                                    consectetur
                                    libero ut convallis. Pellentesque varius odio sit amet augue ornare, ut varius
                                    orci
                                    semper. Donec id placerat diam. Nam pretium nec urna vitae laoreet. Vestibulum
                                    ante
                                    ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris
                                    eu
                                    ultricies ante. Donec tempor sollicitudin nisi, eget aliquam lacus interdum in.
                                    Cras
                                    orci odio, mollis posuere ex ac, mollis tincidunt lectus. Pellentesque sit amet
                                    nisi at
                                    est imperdiet pellentesque id sed purus.</p>
                            </div>
                            <div id={'gallery_container'}>
                                <p id={'gallery_title'}>Gallery</p>
                                <div id={'gallery_content'}>
                                    {this.renderGallery(this.state.gallery)}
                                </div>
                            </div>
                            {/*<div id={'tag_container'}>*/}
                            {/*    <p id={'tag_title'}>Tags</p>*/}
                            {/*    <Tags tags={this.state.user.tags} id={'profile'}/>*/}
                            {/*</div>*/}
                            <div id={'map_container'}>
                                <p id={'map_title'}>Maps</p>
                                <div id={'map_wrapper'}>
                                    <GoogleMaps lat={user.latitude} lon={user.longitude}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    let profile = state.profile;
    let id = state.user.res;
    let logged = state.user.info;
    return {
        profile,
        id,
        logged
    };
}

export default connect(mapStateToProps)(ProfileContainer);
