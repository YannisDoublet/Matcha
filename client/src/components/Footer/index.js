import React from 'react'
import './footer.css'


const Footer = () => {
    return (
        <footer className={'footer_container'}>
            <div className="footer_info">
                <p className={'footer_title'}>© Matcha</p>
                <div className={'footer_info_desc'}>
                    <p className={'footer_desc'}>Lorem ipsum tu coco la famille shana ecrira wola</p>
                </div>
            </div>
            <div className="footer_author">
               <p className={'footer_title'}>Made with <i className="fas fa-heart" style={{color: 'red'}}></i> by shcohen and yadouble</p>
            </div>
            <div className="footer_contact">
                <p className={'footer_title'}>Feel free to send feedback !</p>
            </div>
        </footer>
    );
};

export default Footer;
