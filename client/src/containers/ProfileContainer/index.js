import React, {Component} from 'react'
import {connect} from 'react-redux'
import GoogleMaps from '../../components/GoogleMaps'

import './profile_container.css'

import Alert from '../../components/Widgets/Alert'
import ReportPopUp from '../../components/Widgets/ReportPopUp'
import ProfileCard from '../../components/Widgets/ProfileCard'
import Tags from '../../components/Widgets/Tags'

class ProfileContainer extends Component {

    state = {
        alert: {
            status: false,
            type: '',
            message: ''
        },
        like: 0,
        popUp: 0,
        tags: [
            '#Funny',
            '#Facebook',
            '#Start-up',
            '#Sylicon Valley',
            '#Funny',
            '#Facebook',
            '#Start-up',
            '#Sylicon Valley'
        ],
        gallery: [
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg',
            '/assets/zuckywola.jpg'
        ]
    };

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
        return (
            <div id={'profile'}>
                {alert.status ? <Alert alert={alert} handleAlert={this.handleAlert}/> : null}
                {popUp ? <ReportPopUp popUp={this.showReport} alert={alert}
                                      handleAlert={this.handleAlert} closePopUp={this.closePopUp}/>
                                      : null}
                <div id={'banner_pic_container'} style={{backgroundImage: "url('/assets/banner.png')"}}/>
                <div id={'profile_content_container'}>
                    <ProfileCard {...this.props} like={this.like} like_status={this.state.like}
                                 report={this.showReport} popUp_status={this.state.popUp}/>
                    <div id={'profile_content'}>
                        <div id={'bio_container'}>
                            <p id={'bio_title'}>Biography</p>
                            <p id={'bio_content'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque elit metus, sollicitudin vel nibhas a, imperdiet porta lacus. Ut aliquam scelerisque leo vitae commodo. Morbi mi libero, semper non dictum sed, bibendum vel lectus. Ut scelerisque nisl id bibendum maximus. Pellentesque eleifend ipsum a ipsum fermentum blandit. Nunc ac ligula in nunc dapibus rhoncus ac quis mauris. Cras feugiat consectetur libero ut convallis. Pellentesque varius odio sit amet augue ornare, ut varius orci semper. Donec id placerat diam. Nam pretium nec urna vitae laoreet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris eu ultricies ante. Donec tempor sollicitudin nisi, eget aliquam lacus interdum in. Cras orci odio, mollis posuere ex ac, mollis tincidunt lectus. Pellentesque sit amet nisi at est imperdiet pellentesque id sed purus.</p>
                        </div>
                        <div id={'gallery_container'}>
                            <p id={'gallery_title'}>Gallery</p>
                            <div id={'gallery_content'}>
                                {this.renderGallery(this.state.gallery)}
                            </div>
                        </div>
                        <div id={'tag_container'}>
                            <p id={'tag_title'}>Tags</p>
                            <Tags tags={this.state.tags} />
                        </div>
                        <div id={'map_container'}>
                            <p id={'map_title'}>Maps</p>
                            <div id={'map_wrapper'}>
                                <GoogleMaps />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ProfileContainer);
