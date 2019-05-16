import React, {Component} from 'react';
import {connect} from 'react-redux';

import './matcher_container.css'

import InputTag from '../../components/Widgets/InputTag'
import SettingsBar from '../../components/Widgets/SettingsBar'
import AdvancedResearch from '../../components/Widgets/AdvancedResearch'
import MatchList from '../../components/MatchList'
import ResearchList from '../../containers/ResearchListContainer'

class MatcherContainer extends Component {

    state = {
        users: [
            {
                firstname: 'Mark', lastname: 'Zuckerberg', username: 'Zucky42', age: '34',
                gender: 'Man', sexuality: 'Heterosexual', location: 'San Francisco, USA',
                popularity: '4.5', status: 'Connected', tags: ['Funny', 'Shana', 'Arnaud', 'WOW']
            },
            {
                firstname: 'Mark', lastname: 'Zuckerberg', username: 'Zucky42', age: '34',
                gender: 'Man', sexuality: 'Heterosexual', location: 'San Francisco, USA',
                popularity: '4.5', status: 'Connected', tags: ['Funny', 'Shana', 'Arnaud', 'WOW']
            },
            {
                firstname: 'Mark', lastname: 'Zuckerberg', username: 'Zucky42', age: '34',
                gender: 'Man', sexuality: 'Heterosexual', location: 'San Francisco, USA',
                popularity: '4.5', status: 'Connected', tags: ['Funny', 'Shana', 'Arnaud', 'WOW']
            },
            {
                firstname: 'Mark', lastname: 'Zuckerberg', username: 'Zucky42', age: '34',
                gender: 'Man', sexuality: 'Heterosexual', location: 'San Francisco, USA',
                popularity: '4.5', status: 'Connected', tags: ['Funny', 'Shana', 'Arnaud', 'WOW']
            },
            {
                firstname: 'Mark', lastname: 'Zuckerberg', username: 'Zucky42', age: '34',
                gender: 'Man', sexuality: 'Heterosexual', location: 'San Francisco, USA',
                popularity: '4.5', status: 'Connected', tags: ['Funny', 'Shana', 'Arnaud', 'WOW']
            },
            {
                firstname: 'Mark', lastname: 'Zuckerberg', username: 'Zucky42', age: '34',
                gender: 'Man', sexuality: 'Heterosexual', location: 'San Francisco, USA',
                popularity: '4.5', status: 'Connected', tags: ['Funny', 'Shana', 'Arnaud', 'WOW']
            }
        ],
        tags: [],
        dist: [],
        age: [],
        popularity: [],
        sort: '',
        order: '',
        adv_geo: [],
        adv_search: '',
        advanced_opened: false
    };

    componentDidMount() {
        setTimeout(this.requestDispatcher, 1);
    }

    updateComponentValue = (id, value) => {
        switch (id) {
            case('Tags'):
                this.setState({
                    tags: value
                });
                break;
            case('Geo'):
                this.setState({
                    dist: value
                });
                break;
            case('Age'):
                this.setState({
                    age: value
                });
                break;
            case('Popularity'):
                this.setState({
                    popularity: value
                });
                break;
            case('Sort'):
                this.setState({
                    sort: value
                });
                break;
            case('Order'):
                this.setState({
                    order: value
                });
                break;
            case('Advanced_geo'):
                this.setState({
                    adv_geo: value
                });
                break;
            case('Advanced_search'):
                this.setState({
                    adv_search: value
                });
                break;
            default:
                break;
        }
    };

    deleteComponentValue = (id, value) => {
        if (id === 'Tags') {
            this.setState({
                tags: value
            })
        }
    };

    toggleResearch = () => {
        this.setState({
            advanced_opened: !this.state.advanced_opened
        })
    };

    requestDispatcher = (evt) => {
        const state = this.state;
        const advanced = state.advanced_opened;
        evt && evt.preventDefault();
        let data = {
            tags: state.tags,
            dist: state.dist,
            age: state.age,
            pop: state.popularity,
            sort: state.sort,
            order: state.order
        };
        if (advanced) {
            data = {
                ...data,
                adv_geo: state.adv_geo,
                adv_search: state.adv_search
            };
            this.Vision(data, advanced);
        } else {

        }
    };

    Vision = (data, advanced) => {
        console.log(data, advanced);
    };

    render() {
        console.log(this.state);
        const advanced = this.state.advanced_opened;
        return (
            <div id={'matcher_wrapper'}>
                <div id={'matcher_container'}>
                    <div id={'searchbar_container'}>
                        <InputTag {...this.props} updateValue={this.updateComponentValue}
                                  deleteValue={this.deleteComponentValue}/>
                    </div>
                    <div id={'content_container'}>
                        <form id={'settings_container'} onSubmit={this.requestDispatcher}>
                            <SettingsBar advanced={advanced} updateValue={this.updateComponentValue}
                                         submit={this.requestDispatcher}/>
                            <AdvancedResearch advanced={advanced} open={this.toggleResearch}
                                              updateValue={this.updateComponentValue}
                                              submit={this.requestDispatcher}/>
                        </form>
                        {!advanced ? <MatchList {...this.props} users={this.state.users}/>
                            : <ResearchList users={this.state.users}/>}
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
