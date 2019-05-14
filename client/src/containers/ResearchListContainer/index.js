import React, {Component} from 'react';
import {connect} from 'react-redux';

class ResearchList extends Component {
    render() {
        return (
            <div>
                RECHERCHE
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ResearchList);
