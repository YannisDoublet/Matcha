import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import classnames from 'classnames';
import {verifyToken} from "../../actions/authActions";
import ChatNavbar from '../../components/Widgets/ChatNavbar'
import ChatBox from '../../components/Widgets/ChatBox'
import './chat.css'
import {fetchCard} from "../../actions/chatActions";

class Chat extends Component {

    state = {
        users: [],
        redirect: false,
        active: 0,
        fetch: false,
        sidebar: true
    };

    componentWillMount() {
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.token && !this.state.fetch) {
            if (!nextProps.token.id) {
                this.setState({
                    redirect: true
                })
            } else {
                this.props.dispatch(fetchCard(nextProps.token.id));
                this.setState({
                    fetch: true
                })
            }
        } else if (nextProps.card) {
            this.setState({
                users: nextProps.card
            })
        }
    }

    toggleSidebar = (evt) => {
        this.setState({
            sidebar: !this.state.sidebar
        })
    };

    updateActive = (evt) => {
        this.setState({
            active: evt.target.closest('div#chat_card_wrapper > div').id,
            sidebar: false
        });
    };

    render() {
        let {redirect, users, active, sidebar} = this.state;
        console.log(users);
        return (
            !redirect ?
                <div id={'chat_wrapper'}>
                    <div className={classnames('chat_navbar_container', {'hidden': !sidebar})}>
                        <ChatNavbar users={users} active={this.updateActive}/>
                    </div>
                    <div id={'chat_box_container'}>
                        <ChatBox conversation={users[active]} id={this.props.token ? this.props.token : null}
                                 toggle={this.toggleSidebar}/>
                    </div>
                </div> : <Redirect to={'/register'}/>
        );
    }
}

function mapStateToProps(state) {
    let token = state.user ? state.user.res : null;
    let card = state.chat ? state.chat.res : null;
    return {
        token,
        card
    };
}

export default connect(mapStateToProps)(Chat);