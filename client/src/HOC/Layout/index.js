import React from 'react';
import './layout.css'


import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Layout = (props) => {
    return (
        <div id={'wrapper'}>
            <Header/>
            <div id="container">
                {props.children}
            </div>
            <Footer/>
        </div>
    );
};

export default Layout;
