import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './header.css'

class Header extends Component {

    state = {
        navbarItems: {
            meet: {
                title: 'Match',
                path: '/match',
                restricted: true,
                exclude: false
            },
            search: {
                title: 'Chat',
                path: '/chat',
                restricted: false
            },
            sign_in: {
                title: 'Sign in',
                path: '/register',
                restricted: false,
                exclude: true
            },
            profile: {
                title: 'Profile',
                path: '/profile',
                restricted: true
            },
            logout: {
                title: 'Logout',
                path: '/logout',
                restricted: true
            }
        },
        scrollPosition: 0,
        showNav: true,
        background: false
    };

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
        return (
            <div id={'navbar'} className={`navbar ${nav} ${background}`}>
                <div className={'blur'}/>
                <div className={'navbar_content_left'}>
                    {this.renderNavbarContent({
                            meet: this.state.navbarItems.meet,
                            search: this.state.navbarItems.search
                        }
                    )}
                </div>
                <div className={'navbar_content_middle'}>
                    <Link to={'/'}>
                        <img className={'logo'} src={'/assets/love.svg'} alt={'Logo'}/>
                    </Link>
                </div>
                <div className={'navbar_content_right'}>
                    {this.renderNavbarContent({
                        sign_in: this.state.navbarItems.sign_in,
                        // profile: this.state.navbarItems.profile,
                        // logout: this.state.navbarItems.logout
                    })}
                </div>
            </div>
        );
    }
}

export default Header;
