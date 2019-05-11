import React, {Component} from 'react';
import {connect} from 'react-redux';

import './matcher_container.css'

import InputTag from '../../components/Widgets/InputTag'

class MatcherContainer extends Component {

    state = {
        users: {},
        tags: [],
        geolocation: [],
        age: [],
        popularity: []
    };

    updateComponentValue = (id, value) => {
        if (id === 'Tags') {
            this.setState({
                tags: value
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
        return (
            <div id={'matcher_container'}>
                <div id={'selector_container'}>
                    <InputTag {...this.props} updateValue={this.updateComponentValue}
                              deleteValue={this.deleteComponentValue}/>

                </div>
                <div id={'match_container'}>

                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(MatcherContainer);
