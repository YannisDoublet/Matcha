import React, {Component} from 'react';
import {connect} from 'react-redux';

import './matcher_container.css'

import InputTag from '../../components/Widgets/InputTag'
import SettingsBar from '../../components/Widgets/SettingsBar'
import AdvancedResearch from '../../components/Widgets/AdvancedResearch'
import MatchList from '../../components/MatchList'
import ResearchList from '../../containers/ResearchListContainer'
import {userInfo, verifyToken} from "../../actions/authActions";
import {matchSuggestion} from "../../actions/matchActions";

class MatcherContainer extends Component {

    state = {
        users: [],
        sort: '',
        order: '',
        adv_geo: [],
        adv_search: '',
        count: 0,
        advanced_opened: false
    };

    componentDidMount() {
        setTimeout(this.requestDispatcher, 1);
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.token && nextProps.token !== this.props.token) {
            this.props.dispatch(userInfo(nextProps.token.id))
        } else if (nextProps.logged && nextProps.logged !== this.props.logged) {
            this.props.dispatch(matchSuggestion(nextProps.logged, this.state.count));
            this.setState({
                count: this.state.count + 10
            })
        } else if (nextProps.users && nextProps.users !== this.props.users) {
            this.setState({
                users: nextProps.users
            })
        }
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
        const advanced = this.state.advanced_opened;
        console.log(this.state.users);
        return (
            this.state.users.length > 0 ?
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
