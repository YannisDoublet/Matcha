import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {fetchUserByUsername, uploadPicture, updateProfilePicture, deletePicture} from "../../actions/profileActions";
import {userInfo, verifyToken} from "../../actions/authActions";
import GoogleMaps from '../../components/GoogleMaps'
import Alert from '../../components/Widgets/Alert'
import ReportPopUp from '../../components/Widgets/ReportPopUp'
import ProfileCard from '../../components/Widgets/ProfileCard'
import Tags from '../../components/Widgets/Tags'
import './profile_container.css'

/* ADD PICTURE WIP, INVESTIGATE PROFILE_PIC*/

class ProfileContainer extends Component {

    state = {
        redirect: false,
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
        if (logged && user) {
            this.setState({
                myProfileCheck: false,
                myProfile: logged.username === user.username
            })
        }
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.props.profile && this.props.logged && this.state.myProfileCheck) {
            this.checkMyProfile(this.props.logged, this.props.profile);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.id) {
            this.setState({
                redirect: true
            })
        }
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.props.dispatch(fetchUserByUsername(nextProps.match.params.id));
            this.setState({
                myProfileCheck: true
            })
        } else if (nextProps.id && this.state.firstCheck) {
            this.props.dispatch(userInfo(nextProps.id));
            this.setState({
                firstCheck: false
            })
        } else if (nextProps.pic_status !== this.props.pic_status) {
            if (nextProps.pic_status.status === 'DELETE') {
                if (nextProps.pic_status.type !== 'profile_pic') {
                    this.props.profile.pictures.splice(nextProps.pic_status.pic_id, 1);
                } else {
                    this.props.dispatch(fetchUserByUsername(nextProps.match.params.id));
                }
                this.handleAlert({status: true, type: 'success', message: 'Picture deleted !'});
            } else if (nextProps.pic_status.status === 'UPLOAD') {
                if (nextProps.pic_status.error) {
                    this.handleAlert({status: true, type: 'error', message: nextProps.pic_status.error})
                } else {
                    this.props.profile.pictures.push({picture: nextProps.pic_status.path, type: 'pic'});
                    this.handleAlert({status: true, type: 'success', message: 'Picture uploaded !'});
                }
            } else if (nextProps.pic_status.status === 'UPDATE') {
                this.props.dispatch(fetchUserByUsername(nextProps.match.params.id));
                this.handleAlert({status: true, type: 'success', message: 'Profile picture updated !'});
            }
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

    addPicture = (e) => {
        if (this.props.profile.pictures.length < 6) {
            const data = new FormData();
            data.append('file', e.target.files[0]);
            data.append('id', this.props.id);
            this.props.dispatch(uploadPicture(data));
        }
    };

    updateProfilePicture = (evt, pic) => {
        this.props.dispatch(updateProfilePicture(this.props.id, pic, evt.target.id));
    };

    deletePicture = (evt, pic) => {
        this.props.dispatch(deletePicture(this.props.id, pic, evt.target.id));
    };

    renderGallery = (pictures, myProfile) => {
        console.log(pictures);
        return myProfile ? pictures.map((pic, i) => (
                pic.type !== 'banner_pic' ? <div key={i} id={i} className={'gallery_picture'}
                                                 style={{backgroundImage: `url('${pic.picture}')`}}>
                    <Fragment>
                        <i id={i} className="fas fa-times" onClick={(evt) => this.deletePicture(evt, pic.picture)}/>
                        {pic.type === 'pic' && <i id={i} className="fas fa-pen"
                                                  onClick={(evt) => this.updateProfilePicture(evt, pic.picture)}/>}
                    </Fragment>
                </div> : null))
            :
            pictures.map((pic, i) => (
                pic.type !== 'banner_pic' ? <div key={i} className={'gallery_picture'}
                                                 style={{backgroundImage: `url('${pic.picture}')`}}/> : null
            ));
    };

    render() {
        let {redirect, alert, popUp} = this.state;
        let user = this.props.profile;
        return (
            !redirect ?
                <div id={'profile'}>
                    <Alert alert={alert} handleAlert={this.handleAlert}/>
                    {popUp ? <ReportPopUp popUp={this.showReport} alert={alert}
                                          handleAlert={this.handleAlert} closePopUp={this.closePopUp}/>
                        : null}
                    {user &&
                    <Fragment>
                        <div id={'banner_pic_container'} style={{backgroundImage: `url(${user.pictures[1].picture})`}}/>
                        <div id={'profile_content_container'}>
                            <ProfileCard {...this.props} like={this.like} like_status={this.state.like}
                                         report={this.showReport} popUp_status={popUp}
                                         user={user} myProfile={this.state.myProfile}/>
                            <div id={'profile_content'}>
                                <div id={'bio_container'}>
                                    <p id={'bio_title'}>Biography</p>
                                    <p id={'bio_content'}>{user.bio}</p>
                                </div>
                                <div id={'gallery_container'}>
                                    <p id={'gallery_title'}>Gallery</p>
                                    <div id={'gallery_content'}>
                                        {this.renderGallery(user.pictures, this.state.myProfile)}
                                        {user.pictures.length < 6 &&
                                        <label htmlFor={'upload'} className={'upload'}>
                                            <input id={'upload'} style={{display: 'none'}} type={'file'}
                                                   accept="image/*"
                                                   onChange={(e) => this.addPicture(e)}/>
                                            <i className={'fas fa-plus'}/>
                                        </label>}
                                    </div>
                                </div>
                                <div id={'tag_container'}>
                                    <p id={'tag_title'}>Tags</p>
                                    {user.tag.length > 0 ?
                                        <Tags tags={user.tag} id={'profile'} myProfile={this.state.myProfile}/>
                                        :
                                        <p id={'tags_empty_message'}>No tags entered... Please show your interests to other !</p>
                                    }
                                </div>
                                <div id={'map_container'}>
                                    <p id={'map_title'}>Maps</p>
                                    <div id={'map_wrapper'}>
                                        <GoogleMaps lat={user.latitude} lon={user.longitude}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>}
                </div> : <Redirect to={'/register'}/>
        );
    }
}

function mapStateToProps(state) {
    let profile = state.profile.res;
    let id = state.user.res ? state.user.res.id : null;
    let logged = state.user.info;
    let pic_status = state.profile.pic;
    return {
        profile,
        id,
        logged,
        pic_status
    };
}

export default connect(mapStateToProps)(ProfileContainer);
