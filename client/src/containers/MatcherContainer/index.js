import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import './matcher_container.css'

import InputTag from '../../components/Widgets/InputTag'
import GeolocationSlider from '../../components/Widgets/Geolocation'
import GeolocationInput from '../../components/Widgets/GeolocationInput'
import AgeSlider from '../../components/Widgets/Age_Slider'
import PopularitySlider from '../../components/Widgets/Popularity_Slider'
import SortResult from '../../components/Widgets/SortResult'
import SearchUser from '../../components/Widgets/SearchUser'
import MatchList from '../../components/MatchList'
import ResearchList from '../../containers/ResearchListContainer'

class MatcherContainer extends Component {

    state = {
        users: [
            {
                firstname: 'Mark', lastname: 'Zuckerberg', username: 'Zucky42' , age: '34',
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
        sort: [],
        adv_geo: [],
        adv_search: '',
        advanced_opened: false
    };

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
            case('Advanced_geo'):
                this.setState({
                    adv_geo: value
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

    Vision = () => {

    };

    render() {
        const advanced = this.state.advanced_opened;
        return (
            <div id={'matcher_container'}>
                <div id={'searchbar_container'}>
                    <InputTag {...this.props} updateValue={this.updateComponentValue}
                              deleteValue={this.deleteComponentValue}/>
                </div>
                <div id={'content_container'}>
                    <div id={'settings_container'}>
                        <div id={'research_container'}>
                            <p id={'container_title'}>Sorted by</p>
                            <SortResult updateValue={this.updateComponentValue}/>
                            <p id={'container_title'}>Filter by</p>
                            <GeolocationSlider updateValue={this.updateComponentValue}/>
                            <AgeSlider updateValue={this.updateComponentValue}/>
                            <PopularitySlider updateValue={this.updateComponentValue}/>
                        </div>
                        <div id={'advanced_research_container'}>
                            <div id={'advanced_research_title'} onClick={this.toggleResearch}>
                                <p id={'advanced_title'}>
                                    Advanced research
                                    <img id={'arrow-down'} src={'/assets/down-arrow.svg'} alt={'arrow-down'}/>
                                </p>
                            </div>
                            <div id={'advanced_research_content'}
                                 className={classnames('', {'active_dropdown': this.state.advanced_opened})}>
                                <GeolocationInput updateValue={this.updateComponentValue}/>
                                <SearchUser updateValue={this.updateComponentValue}/>
                            </div>
                        </div>
                    </div>
                    {!advanced ? <MatchList {...this.props} users={this.state.users} />
                        :
                    <ResearchList geo={this.state.adv_geo} search={this.state.adv_search} />}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(MatcherContainer);
