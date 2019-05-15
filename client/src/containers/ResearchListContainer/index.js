import React, {Component} from 'react'
import {connect} from 'react-redux'
import './research_list.css'

class ResearchList extends Component {
    render() {
        return (
            <div id={'research_list_container'}>
                RECHERCHE
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ResearchList);
