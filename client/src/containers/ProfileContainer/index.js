import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
    fetchUserByUsername, checkLike, checkBlock, checkMatch, addTag, deleteTag, manageBio, uploadPicture,
    updateProfilePicture, deletePicture
} from "../../actions/profileActions";
import {userInfo, verifyToken} from "../../actions/authActions";
import {likeUser, dislikeUser} from "../../actions/matchActions";
import GoogleMaps from '../../components/GoogleMaps'
import Alert from '../../components/Widgets/Alert'
import ReportPopUp from '../../components/Widgets/ReportPopUp'
import ProfileCard from '../../components/Widgets/ProfileCard'
import Tags from '../../components/Widgets/Tags'
import InputTag from "../../components/Widgets/InputTag";
import './profile_container.css'
import socketIOClient from "socket.io-client";
import {ENDPOINT} from "../../config/socket";

class ProfileContainer extends Component {

    state = {
        redirect: false,
        myProfile: false,
        myProfileCheck: true,
        firstCheck: true,
        sendNotif: true,
        inputTag: false,
        inputBio: false,
        inputValue: '',
        alert: {
            status: false,
            type: '',
            message: ''
        },
        like: 0,
        popUp: 0
    };

    componentWillMount() {
        if (this.props.location.state) {
            this.handleAlert(this.props.location.state);
        }
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
        if (this.props.match.params.id) {
            this.props.dispatch(fetchUserByUsername(this.props.match.params.id));
        }
    }

    checkMyProfile = (logged, user) => {
        if (logged && user) {
            this.setState({
                myProfileCheck: false,
                myProfile: logged.username === user.username,
                inputTag: false,
                inputBio: false
            })
        }
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (!nextState.myProfile && nextState.myProfileCheck) {
            this.props.dispatch(checkLike(nextProps.id, this.props.match.params.id));
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
                myProfileCheck: true,
                sendNotif: true,
                firstCheck: true
            })
        } else if (nextProps.id && this.state.firstCheck) {
            this.props.dispatch(userInfo(nextProps.id));
            this.props.dispatch(checkBlock(nextProps.id, this.props.match.params.id));
            this.setState({
                firstCheck: false
            })
        } else if (nextProps.logged && nextProps.profile && this.state.myProfileCheck) {
            this.checkMyProfile(nextProps.logged, nextProps.profile);
        } else if (nextProps.logged && nextProps.profile && this.state.myProfile === false && this.state.sendNotif) {
            socketIOClient(ENDPOINT).emit('visitProfile', {
                sender: this.props.id,
                receiver: this.props.profile.username,
                type: 'visitProfile',
                img: this.props.logged.pictures[0].picture
            });
            this.setState({
                sendNotif: false
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
        } else if (nextProps.tag !== this.props.tag) {
            this.props.dispatch(fetchUserByUsername(nextProps.match.params.id));
            if (this.state.inputTag) {
                this.setState({
                    inputTag: !this.state.inputTag
                })
            }
        } else if (nextProps.bio !== this.props.bio) {
            this.props.dispatch(fetchUserByUsername(nextProps.match.params.id));
        } else if (nextProps.liked_status !== this.props.liked_status) {
            this.setState({
                like: nextProps.liked_status.like,
            })
        } else if (nextProps.like !== this.props.like) {
            this.props.dispatch(fetchUserByUsername(this.props.profile.username));
        } else if (nextProps.blocked !== this.props.blocked) {
            this.props.dispatch(fetchUserByUsername(this.props.profile.username));
        } else if (nextProps.match_status !== this.props.match_status) {
            if (nextProps.match_status === 1) {
                socketIOClient(ENDPOINT).emit('matchUser', {
                    firstUser: this.props.id,
                    secondUser: this.props.profile.username
                });
            } else {
                socketIOClient(ENDPOINT).emit('likeUser', {
                    receiver: this.props.profile.username
                });
            }
        }
    }

    closePopUp = (status) => {
        this.props.dispatch(checkBlock(this.props.id, this.props.profile.username));
        this.props.dispatch(checkLike(this.props.id, this.props.match.params.id));
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

    handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    };

    like = () => {
        let like = this.state.like;
        if (like === 'no_one' || like === 'other' || like === 'dislike') {
            this.props.dispatch(likeUser(this.props.id, this.props.match.params.id))
                .then(() => {
                    this.props.dispatch(checkMatch(this.props.id, this.props.profile.username));
                    this.setState({
                        like: 'you'
                    })
                })
        } else if (like === 'you' || like === 'match') {
            this.props.dispatch(dislikeUser(this.props.id, this.props.match.params.id))
                .then(() => {
                    socketIOClient(ENDPOINT).emit('dislikeUser', {
                        receiver: this.props.profile.username
                    });
                    this.setState({
                        like: 'no_one'
                    })
                })
        }
    };

    showReport = () => {
        this.state.popUp ? this.setState({
            popUp: 0
        }) : this.setState({
            popUp: 1
        })
    };

    editInfo = (e) => {
        if (e.target.id === 'tag_edit') {
            this.setState({
                inputTag: !this.state.inputTag
            })
        } else if (e.target.id === 'bio_edit') {
            this.setState({
                inputBio: !this.state.inputBio
            })
        }
    };

    addTag = (newTag) => {
        this.props.dispatch(addTag(this.props.id, newTag));
    };

    deleteTag = (e) => {
        this.props.dispatch(deleteTag(this.props.id, e.target.childNodes[0].data));
    };

    manageBio = (e) => {
        e.preventDefault();
        this.props.dispatch(manageBio(this.props.id, this.state.inputValue));
        this.setState({
            inputValue: '',
            inputBio: false
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
        socketIOClient(ENDPOINT).emit('reloadProfile', {id: this.props.id});
    };

    deletePicture = (evt, pic) => {
        this.props.dispatch(deletePicture(this.props.id, pic, evt.target.id));
    };

    renderGallery = (pictures, myProfile) => {
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
        let blocked = this.props.blocked;
        return (
            !redirect ?
                <div id={'profile'}>
                    <Alert alert={alert} handleAlert={this.handleAlert}/>
                    {popUp ? <ReportPopUp popUp={this.showReport} alert={alert}
                                          handleAlert={this.handleAlert} closePopUp={this.closePopUp}
                                          blocked={this.props.blocked}/> : null}
                    {user &&
                    <Fragment>
                        <div id={'banner_pic_container'} style={{backgroundImage: `url(${user.pictures[1].picture})`}}/>
                        <div id={'profile_content_container'}>
                            <ProfileCard {...this.props} like={this.like} like_status={this.state.like}
                                         report={this.showReport} popUp_status={popUp}
                                         user={user} myProfile={this.state.myProfile} liked={this.state.like}
                                         blocked={blocked}/>
                            <div id={'profile_content'}>
                                <div id={'bio_container'}>
                                    <div id={'bio_title_container'}>
                                        <p id={'bio_title'}>Bio</p>
                                        {this.state.myProfile ?
                                            <i id={'bio_edit'} className="far fa-edit"
                                               onClick={(e) => this.editInfo(e)}/>
                                            : null}
                                    </div>
                                    {!this.state.inputBio ? <p id={'bio_content'}>{user.bio.length ? user.bio
                                        :
                                        'Write a bio to introduce you to others !'}</p>
                                        :
                                        <form id={'bio_form'} onSubmit={this.manageBio}>
                                            <input id={'bio_input'} type={'text'} onChange={(e) => this.handleChange(e)}
                                                   value={this.state.inputValue} placeholder={'Don\'t be shy !'}
                                                   autoFocus={true}/>
                                        </form>}
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
                                    <div id={'tag_title_container'}>
                                        <p id={'tag_title'}>Tags</p>
                                        {this.state.myProfile &&
                                        <i id={'tag_edit'} className="far fa-edit" onClick={(e) => this.editInfo(e)}/>}
                                    </div>
                                    {!this.state.inputTag ? user.tag.length > 0 ?
                                        <Tags tags={user.tag} myProfile={this.state.myProfile}
                                              id={this.state.myProfile ? 'myTags' : 'tags'} delete={this.deleteTag}/>
                                        :
                                        <p id={'tags_empty_message'}>No tags entered... Please show your interests to
                                            other !</p>
                                        : <InputTag {...this.props} id={this.state.myProfile ? 'myProfile' : 'others'}
                                                    mytags={user.tag} addTag={this.addTag}/>}
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
    let tag = state.profile.tag;
    let bio = state.profile.bio;
    let liked_status = state.profile.liked;
    let like = state.match.like;
    let blocked = state.profile.blocked;
    let match_status = state.profile.match_status;
    return {
        profile,
        id,
        logged,
        pic_status,
        tag,
        bio,
        liked_status,
        like,
        blocked,
        match_status
    };
}

export default connect(mapStateToProps)(ProfileContainer);
