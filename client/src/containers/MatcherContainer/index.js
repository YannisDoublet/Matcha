import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import InputTag from '../../components/Widgets/InputTag'
import SettingsBar from '../../components/Widgets/SettingsBar'
import AdvancedResearch from '../../components/Widgets/AdvancedResearch'
import MatchList from '../../components/MatchList'
import ResearchList from '../../containers/ResearchListContainer'
import {userInfo, verifyToken} from '../../actions/authActions'
import filterUtils from '../../components/Widgets/FiltersUtils/filterUtils'
import {matchSuggestion, likeUser, dislikeUser, researchUsers} from '../../actions/matchActions'
import './matcher_container.css'

class MatcherContainer extends Component {

    state = {
        users: [],
        research: [],
        filter: [],
        redirect: false,
        tags: {value: [], touched: false},
        dist: {value: [], touched: false},
        age: {value: [], touched: false},
        pop: {value: [], touched: false},
        sort: {value: '', touched: false},
        order: {value: '', touched: false},
        adv_geo: {value: [], touched: false},
        adv_search: {value: '', touched: false},
        count: 0,
        fetchMatch: true,
        advanced_opened: false
    };

    componentWillMount() {
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.token && nextProps.token !== this.props.token) {
            if (!nextProps.token.id) {
                this.setState({
                    redirect: true
                })
            } else {
                this.props.dispatch(userInfo(nextProps.token.id));
            }
        } else if (this.state.fetchMatch) {
            this.props.dispatch(matchSuggestion(nextProps.logged, this.state.count));
            this.setState({
                count: this.state.count + 10,
                fetchMatch: false
            })
        } else if (nextProps.users && nextProps.users !== this.props.users) {
            this.setState({
                users: nextProps.users
            })
        } else if (nextProps.research && nextProps.research !== this.props.research) {
            this.setState({
                research: nextProps.research
            }, () => {
                this.filterUsers('research')
            })
        }
    }

    filterUsers = () => {
        let {users, tags, dist, age, pop, sort, order, research} = this.state;
        let filter;

        filter = this.state.advanced_opened ? research : users;
        new Promise((resolve, reject) => {
            resolve(filter)
        }).then(filter => {
            return filterUtils.filterTags(filter, tags)
        }).then(filter => {
            return filterUtils.filterDist(filter, dist)
        }).then(filter => {
            return filterUtils.filterAge(filter, age)
        }).then(filter => {
            return filterUtils.filterPopularity(filter, pop)
        }).then(filter => {
            return filterUtils.filterOrderSort(filter, order, sort)
        }).then(filter => {
            this.setState({
                filter: filter
            })
        })
    };

    like = (username) => {
        this.props.dispatch(likeUser(this.props.token.id, username));
    };

    dislike = (username) => {
        this.props.dispatch(dislikeUser(this.props.token.id, username));
    };

    researchUsers = () => {
        let lat = this.state.adv_geo.touched && this.state.adv_geo.value.lat ?
            this.state.adv_geo.value.lat : this.props.logged.latitude;
        let lng = this.state.adv_geo.touched && this.state.adv_geo.value.lng ?
            this.state.adv_geo.value.lng : this.props.logged.longitude;
        let name = this.state.adv_search.touched && this.state.adv_search.value ? this.state.adv_search.value : null;
        this.props.dispatch(researchUsers(this.props.token.id, name, lat, lng));
    };

    fetchMatch = () => {
        this.props.dispatch(matchSuggestion(this.props.logged, this.state.count));
        this.setState({
            count: this.state.count + 10,
        })
    };

    resetValue = (e) => {
        e.preventDefault();
        document.getElementById('slider').noUiSlider.reset();
        document.getElementById('age_slider').noUiSlider.reset();
        document.getElementById('popularity_slider').noUiSlider.reset();
        this.setState({
            tags: {value: [], touched: false},
            dist: {value: [], touched: false},
            age: {value: [], touched: false},
            pop: {value: [], touched: false},
            sort: {value: '', touched: false},
            order: {value: '', touched: false},
            adv_geo: {value: [], touched: false},
            adv_search: {value: '', touched: false},
            filter: []
        })
    };

    updateComponentValue = (id, value) => {
        switch (id) {
            case('Tags'):
                this.setState({
                    tags: {
                        value: value,
                        touched: true
                    }
                });
                break;
            case('Geo'):
                this.setState({
                    dist: {
                        value: value,
                        touched: true
                    }
                });
                break;
            case('Age'):
                this.setState({
                    age: {
                        value: value,
                        touched: true
                    }
                });
                break;
            case('Popularity'):
                this.setState({
                    pop: {
                        value: value,
                        touched: true
                    }
                });
                break;
            case('Sort'):
                this.setState({
                    sort: {
                        value: value,
                        touched: true
                    }
                });
                break;
            case('Order'):
                this.setState({
                    order: {
                        value: value,
                        touched: true
                    }
                });
                break;
            case('Advanced_geo'):
                this.setState({
                    adv_geo: {
                        value: value,
                        touched: true
                    }
                });
                break;
            case('Advanced_search'):
                this.setState({
                    adv_search: {
                        value: value,
                        touched: true
                    }
                });
                break;
            default:
                break;
        }
    };

    deleteComponentValue = (id, value) => {
        if (id === 'Tags') {
            this.setState({
                tags: {
                    ...this.state.tags,
                    value: value
                }
            })
        }
    };

    toggleResearch = (e) => {
        this.setState({
            advanced_opened: !this.state.advanced_opened
        });
        this.resetValue(e)
    };

    render() {
        const advanced = this.state.advanced_opened;
        let redirect = this.state.redirect;
        let list = this.state.filter.length > 0 ? this.state.filter : this.state.users;
        return (
            !redirect ?
                <div id={'matcher_wrapper'}>
                    <div id={'matcher_container'}>
                        <div id={'searchbar_container'}>
                            <InputTag {...this.props} updateValue={this.updateComponentValue}
                                      deleteValue={this.deleteComponentValue} id={'searchbar'}/>
                        </div>
                        <div id={'content_container'}>
                            <div id={'settings_container'} onSubmit={this.filterUsers}>
                                <SettingsBar advanced={advanced} updateValue={this.updateComponentValue}
                                             submit={(e) => this.filterUsers('matcher')} reset={this.resetValue}/>
                                <AdvancedResearch advanced={advanced} open={this.toggleResearch}
                                                  updateValue={this.updateComponentValue}
                                                  submit={this.researchUsers} reset={this.resetValue}/>
                            </div>
                            {!advanced && list.length ?
                                <MatchList {...this.props} users={list} fetchMatch={this.fetchMatch}
                                           research={this.state.advanced_opened} like={this.like}
                                           dislike={this.dislike}/>
                                : <ResearchList match={this.props.match} users={this.state.filter}
                                                filter={this.filterUsers} research={this.state.advanced_opened}/>}
                        </div>
                    </div>
                </div> : <Redirect to={'/register'}/>
        );
    }
}

function mapStateToProps(state) {
    let token = state.user.res;
    let logged = state.user.info;
    let users = state.match.users;
    let research = state.match.research;
    return {
        token,
        logged,
        users,
        research
    };
}

export default connect(mapStateToProps)(MatcherContainer);