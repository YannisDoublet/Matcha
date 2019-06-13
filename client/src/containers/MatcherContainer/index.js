import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import InputTag from '../../components/Widgets/InputTag'
import SettingsBar from '../../components/Widgets/SettingsBar'
import AdvancedResearch from '../../components/Widgets/AdvancedResearch'
import MatchList from '../../components/MatchList'
import ResearchList from '../../containers/ResearchListContainer'
import {userInfo, verifyToken} from "../../actions/authActions";
import {matchSuggestion, researchUsers} from "../../actions/matchActions";
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
        } else if (nextProps.precise && nextProps.precise !== this.props.precise) {
            this.setState({
                filter: nextProps.precise
            })
        }
    }

    filterUsers = (field) => {
        let {tags, dist, age, pop, sort, order, research, adv_search} = this.state;
        let filter = [];
        if (adv_search.touched && adv_search.value.length > 0) {
            let search = adv_search.value.split(' ').join('').toLowerCase();
            research.map((user, i) => {
                let name = user.firstname.toLowerCase() + user.lastname.toLowerCase();
                if (name.indexOf(search) !== -1) {
                    return filter[i] = user;
                } else {
                    return null;
                }
            });
        }
        if (tags.touched && tags.value.length > 0) {
            let tab = filter.length > 0 ? filter : field === 'matcher' ? this.state.users : this.state.research;
            let valid = [];
            tab.map(user => {
                let checkTags = [];
                user.tag.forEach(tag => {
                    tags.value.filter(val => val.indexOf(tag) === 0 ? checkTags.push(tag) : checkTags);
                });
                if (checkTags.length === tags.value.length) {
                   return valid.push(user);
                } else {
                    return null;
                }
            });
            filter = valid;
        }
        if (dist.touched) {
            let tab = filter.length > 0 ? filter : field === 'matcher' ? this.state.users : this.state.research;
            let checkDist = [];
            tab.forEach(user => {
                parseInt(user.dist) >= dist.value[0] && parseInt(user.dist) <= dist.value[1] && checkDist.push(user);
            });
            filter = checkDist;
        }
        if (age.touched) {
            let tab = filter.length > 0 ? filter : field === 'matcher' ? this.state.users : this.state.research;
            let checkAge = [];
            tab.forEach(user => {
                parseInt(user.age) >= age.value[0] && parseInt(user.age) <= age.value[1] && checkAge.push(user);
            });
            filter = checkAge;
        }
        if (pop.touched) {
            let tab = filter.length > 0 ? filter : field === 'matcher' ? this.state.users : this.state.research;
            let checkPop = [];
            tab.forEach(user => {
                user.score >= pop.value[0] && user.score <= pop.value[1] && checkPop.push(user);
            });
            filter = checkPop;
        }
        if (order.touched && !sort.touched) {

        }
        if (sort.touched) {
            let tab = filter.length > 0 ? filter : field === 'matcher' ? this.state.users : this.state.research;
            let ord = order.touched ? order.value : 'Ascending';

            switch (sort.value) {
                case 'Tags':
                    if (ord === 'Ascending') {
                        tab.sort((a, b) => (a.match_tag > b.match_tag) ? -1 :
                            ((b.match_tag > a.match_tag) ? 1 : 0));
                    } else {
                        tab.sort((a, b) => (a.match_tag > b.match_tag) ? 1 :
                            ((b.match_tag > a.match_tag) ? -1 : 0));
                    }
                    filter = tab;
                    break;
                case 'Location':
                    if (ord === 'Ascending') {
                        tab.sort((a, b) => (parseInt(a.dist) > parseInt(b.dist)) ? -1 :
                            ((parseInt(b.dist) > parseInt(a.dist)) ? 1 : 0));
                    } else {
                        tab.sort((a, b) => (parseInt(a.dist) > parseInt(b.dist)) ? 1 :
                            ((parseInt(b.dist) > parseInt(a.dist)) ? -1 : 0));
                    }
                    filter = tab;
                    break;
                case 'Age':
                    if (ord === 'Ascending') {
                        tab.sort((a, b) => (parseInt(a.age) > parseInt(b.age)) ? -1 :
                            ((parseInt(b.age) > parseInt(a.age)) ? 1 : 0));
                    } else {
                        tab.sort((a, b) => (parseInt(a.age) > parseInt(b.age)) ? 1 :
                            ((parseInt(b.age) > parseInt(a.age)) ? -1 : 0));
                    }
                    filter = tab;
                    break;
                case 'Popularity':
                    if (ord === 'Ascending') {
                        tab.sort((a, b) => (a.score > b.score) ? -1 :
                            (b.score > a.score) ? 1 : 0);
                    } else {
                        tab.sort((a, b) => (a.score > b.score) ? 1 :
                            (b.score > a.score) ? -1 : 0);
                    }
                    filter = tab;
                    break;
                default:
                    break;
            }
        }
        this.setState({
            filter: filter
        })
    };

    researchUsers = () => {
        let lat = this.state.adv_geo.touched && this.state.adv_geo.value.lat ?
            this.state.adv_geo.value.lat : this.props.logged.latitude;
        let lng = this.state.adv_geo.touched && this.state.adv_geo.value.lng ?
            this.state.adv_geo.value.lng : this.props.logged.longitude;
        this.props.dispatch(researchUsers(this.props.token.id, lat, lng));
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
                                      deleteValue={this.deleteComponentValue}/>
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
                                <MatchList {...this.props} users={list} fetchMatch={this.fetchMatch}/>
                                : <ResearchList match={this.props.match} users={this.state.filter}
                                                filter={(e) => this.filterUsers('research')}/>}
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