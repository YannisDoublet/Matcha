import React, {Component} from 'react';
import {connect} from 'react-redux';
import InputTag from '../../components/Widgets/InputTag'
import SettingsBar from '../../components/Widgets/SettingsBar'
import AdvancedResearch from '../../components/Widgets/AdvancedResearch'
import MatchList from '../../components/MatchList'
import ResearchList from '../../containers/ResearchListContainer'
import {userInfo, verifyToken} from "../../actions/authActions";
import {matchSuggestion} from "../../actions/matchActions";
import './matcher_container.css'

/* REGLER ERREUR UNMOUNTED COMPONENT STATE UPDATE REACT IN PROFILE CARD */

/* ADVANCED MATCHLIST */

class MatcherContainer extends Component {

    state = {
        users: [],
        filter: [],
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
            this.props.dispatch(userInfo(nextProps.token.id));
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
        }
    }

    filterUsers = (e) => {
        e.preventDefault();
        let {tags, dist, age, pop, sort, order} = this.state;
        let filter = [];
        if (tags.touched && tags.value.length > 0) {
            let tab = this.state.users;
            let valid = [];
            tab.map(user => {
                let checkTags = [];
                user.tag.forEach(tag => {
                    tags.value.filter(val => val.indexOf(tag) === 0 ? checkTags.push(tag) : checkTags);
                });
                if (checkTags.length === tags.value.length) {
                    valid.push(user);
                }
            });
            filter = valid;
        }
        if (dist.touched) {
            let tab = filter.length > 0 ? filter : this.state.users;
            let checkDist = [];
            tab.forEach(user => {
                parseInt(user.dist) >= dist.value[0] && parseInt(user.dist) <= dist.value[1] && checkDist.push(user);
            });
            filter = checkDist;
        }
        if (age.touched) {
            let tab = filter.length > 0 ? filter : this.state.users;
            let checkAge = [];
            tab.forEach(user => {
                parseInt(user.age) >= age.value[0] && parseInt(user.age) <= age.value[1] && checkAge.push(user);
            });
            filter = checkAge;
        }
        if (pop.touched) {
            let tab = filter.length > 0 ? filter : this.state.users;
            let checkPop = [];
            tab.forEach(user => {
                user.score >= pop.value[0] && user.score <= pop.value[1] && checkPop.push(user);
            });
            filter = checkPop;
        }
        if (order.touched && !sort.touched) {

        }
        console.log(filter);
        if (sort.touched) {
            let tab = filter.length > 0 ? filter : this.state.users;
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
            }
        }
        this.setState({
            filter: filter
        })
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

    toggleResearch = () => {
        this.setState({
            advanced_opened: !this.state.advanced_opened
        })
    };

    render() {
        const advanced = this.state.advanced_opened;
        let list = this.state.filter.length > 0 ? this.state.filter : this.state.users;
        console.log(list);
        return (
            list ?
                <div id={'matcher_wrapper'}>
                    <div id={'matcher_container'}>
                        <div id={'searchbar_container'}>
                            <InputTag {...this.props} updateValue={this.updateComponentValue}
                                      deleteValue={this.deleteComponentValue}/>
                        </div>
                        <div id={'content_container'}>
                            <div id={'settings_container'} onSubmit={this.filterUsers}>
                                <SettingsBar advanced={advanced} updateValue={this.updateComponentValue}
                                             submit={this.filterUsers} reset={this.resetValue}/>
                                <AdvancedResearch advanced={advanced} open={this.toggleResearch}
                                                  updateValue={this.updateComponentValue}
                                                  submit={this.filterUsers}/>
                            </div>
                            {!advanced ?
                                <MatchList {...this.props} users={list} fetchMatch={this.fetchMatch}/>
                                : <ResearchList users={list} match={this.props.match}/>}
                        </div>
                    </div>
                </div> : null
        );
    }
}

function mapStateToProps(state) {
    let token = state.user.res;
    let logged = state.user.info;
    let users = state.match.users;
    return {
        token,
        logged,
        users
    };
}

export default connect(mapStateToProps)(MatcherContainer);
