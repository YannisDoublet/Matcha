import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import HeaderConnectedOptions from './header_connected_options'
import {verifyToken} from "../../actions/authActions";
import './header.css'

class Header extends Component {

    state = {
        navbarItems: {
            match: {
                title: 'Match',
                path: '/match',
                restricted: true,
                exclude: false
            },
            chat: {
                title: 'Chat',
                path: '/chat',
                restricted: false
            },
            sign_in: {
                title: 'Sign in',
                path: '/register',
                restricted: false,
                exclude: true
            }
        },
        scrollPosition: 0,
        showNav: true,
        background: false,
        connected: false
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.user.res.id) {
            this.setState({
                connected: true
            });
        }
    }

    toggleBackground = () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st >= document.body.clientHeight / 2.80) {
            this.setState({
                background: true
            })
        } else {
            this.setState({
                background: false
            })
        }
    };

    hideNavbar = () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > this.state.scrollPosition) {
            this.setState({
                showNav: false
            })
        } else {
            this.setState({
                showNav: true
            })
        }
        this.setState({
            scrollPosition: st <= 0 ? 0 : st
        })
    };

    componentDidMount() {
        this.props.dispatch(verifyToken(localStorage.getItem('T')));
        window.addEventListener("scroll", this.hideNavbar, false);
        window.addEventListener('scroll', this.toggleBackground, false)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.hideNavbar);
        window.removeEventListener('scroll', this.toggleBackground);
    }

    renderNavbarContent = (items) => {
        return Object.entries(items).map((item, i) => (
            <div className={'navbar_item'} key={i}>
                <Link to={item[1].path} key={i}>{item[1].title}</Link>
            </div>
        ))
    };

    render() {
        const nav = this.state.showNav ? '' : 'hide';
        const background = this.state.background ? 'background' : '';
        const connected = this.state.connected;
        return (
            <div id={'navbar'} className={`navbar ${nav} ${background}`}>
                <div className={'blur'}/>
                <div className={'navbar_content_left'}>
                    {this.renderNavbarContent({
                            match: this.state.navbarItems.match,
                            chat: this.state.navbarItems.chat
                        }
                    )}
                </div>
                <div className={'navbar_content_middle'}>
                    <Link to={'/'}>
                        <img className={'logo'} src={'/assets/love.svg'} alt={'Logo'}/>
                    </Link>
                </div>
                <div className={'navbar_content_right'}>
                    {connected === true ? <HeaderConnectedOptions id={this.props.user.res.id} location={this.props.location}/> :
                        this.renderNavbarContent({
                        sign_in: this.state.navbarItems.sign_in
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const user = state.user;
    return {
        user
    };
}

export default connect(mapStateToProps)(Header);
