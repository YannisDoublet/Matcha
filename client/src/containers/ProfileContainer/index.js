import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {fetchUserByUsername, uploadPicture, deletePicture} from "../../actions/profileActions";
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
        } else if (nextProps.pic_status) {
            if (nextProps.pic_status.status === 'DELETE') {
                this.props.profile.pictures.splice(nextProps.pic_status.pic_id, 1);
                this.handleAlert({status: true, type: 'success', message: 'Picture deleted !'});
            } else if (nextProps.pic_status.status === 'UPLOAD') {
                console.log(nextProps.pic_status);
                if (nextProps.pic_status.error) {
                    this.handleAlert({status: true, type: 'error', message: nextProps.pic_status.error})
                } else {
                    this.props.profile.pictures.push({picture: nextProps.pic_status.path, type: 'pic'});
                    this.handleAlert({status: true, type: 'success', message: 'Picture uploaded !'});
                }
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

    deletePicture = (evt, pic) => {
        this.props.dispatch(deletePicture(this.props.id, pic, evt.target.id))
    };

    renderGallery = (pictures, myProfile) => {
        return myProfile ? pictures.map((pic, i) => (
            pic.type !== 'banner_pic' ? <div key={i} id={i} className={'gallery_picture'}
                     style={{backgroundImage: `url('${pic.picture}')`, cursor: pic.type === 'pic' ? 'pointer': 'default'}}
                                             onClick={pic.type === 'pic' ? (evt) => this.deletePicture(evt, pic.picture) : (evt) => this.updateProfilePicture(evt)}>
                {pic.type === 'pic' && <i className="fas fa-times"/>}
            </div> : null))
            :
            pictures.map((pic, i) => (
                pic.type !== 'banner_pic' ? <div key={i} className={'gallery_picture'}
                                                 style={{backgroundImage: `url('${pic.picture}')`}}/> : null
            ));
    };

    render() {
        let alert = this.state.alert;
        let popUp = this.state.popUp;
        let user = this.props.profile;
        console.log(user);
        return (
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
                                     report={this.showReport} popUp_status={this.state.popUp}
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
                                        <input id={'upload'} style={{display: 'none'}} type={'file'} accept="image/*"
                                               onChange={(e) => this.addPicture(e)}/>
                                        <i className={'fas fa-plus'}/>
                                    </label>}
                                </div>
                            </div>
                            <div id={'tag_container'}>
                                <p id={'tag_title'}>Tags</p>
                                <Tags tags={user.tag} id={'profile'} myProfile={this.state.myProfile}/>
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
            </div>
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
