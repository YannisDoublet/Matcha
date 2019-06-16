import React from 'react';
import {Switch, Route} from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Logout from './components/Logout'
import Profile from './components/Profile'
import Settings from './containers/SettingsContainer'
import Matcher from './components/Matcher'
import Chat from './containers/ChatContainer'
import Layout from './HOC/Layout'
import ValidateEmail from './components/Widgets/ValidateEmail'

const Routes = () => {
    return (
        <Switch>
            <Route path={'/register'} exact component={Login}/>
            <Route path={'/validate:token'} exact component={ValidateEmail} />
            <Route path={'/logout'} exact component={Logout} />
            <Layout>
                <Route path={'/'} exact component={Home}/>
                <Route path={'/profile/:id'} exact component={Profile} />
                <Route path={'/settings/:id'} exact component={Settings} />
                <Route path={'/match'} exact component={Matcher} />
                <Route path={'/chat'} exact component={Chat} />
            </Layout>
        </Switch>
    );
};

export default Routes