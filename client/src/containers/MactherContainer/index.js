import React, {Component} from 'react';
import {connect} from 'react-redux';

import './matcher_container.css'

import InputTag from '../../components/Widgets/InputTag'
import Geolocation from '../../components/Widgets/Geolocation'
import Age from '../../components/Widgets/Age_Slider'
import Popularity from '../../components/Widgets/Popularity_Slider'

class MatcherContainer extends Component {

    state = {
        users: {},
        tags: [],
        dist: [],
        age: [],
        popularity: []
    };

    updateComponentValue = (id, value) => {
        if (id === 'Tags') {
            this.setState({
                tags: value
            })
        } else if (id === 'Geo') {
            this.setState({
                dist: value
            })
        } else if (id === 'Age') {
            this.setState({
                age: value
            })
        } else if (id === 'Popularity') {
            this.setState({
                popularity: value
            })
        }
    };

    deleteComponentValue = (id, value) => {
        if (id === 'Tags') {
            this.setState({
                tags: value
            })
        }
    };

    Vision = () => {

    };

    render() {
        console.log(this.state);
        return (
            <div id={'matcher_container'}>
                <div id={'searchbar_container'}>
                    <InputTag {...this.props} updateValue={this.updateComponentValue}
                              deleteValue={this.deleteComponentValue}/>
                </div>
                <div id={'content_container'}>
                    <div id={'research_container'}>
                        <p id={'container_title'}>Filter by</p>
                        <Geolocation updateValue={this.updateComponentValue}/>
                        <Age updateValue={this.updateComponentValue}/>
                        <Popularity updateValue={this.updateComponentValue}/>
                    </div>
                    <div id={'match_container'}>
                        HEY
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(MatcherContainer);
