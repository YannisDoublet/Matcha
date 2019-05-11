import React, {Component} from 'react';
import {connect} from 'react-redux';
import Card from '../../components/Widgets/Card'
import './home.css'

class HomeContainer extends Component {

    state = {
        card: {
            type: 'Home',
            card1: {
                img: '/assets/undraw_social_life_4np1.svg',
                title: 'Match.',
                content: 'Swipe and match your future date'
            },
            card2: {
                img: '/assets/undraw_intense_feeling_ft9s.svg',
                title: 'Meet.',
                content: 'Meet your beloved one'
            },
            card3: {
                img: '/assets/undraw_love_xfcv.svg',
                title: 'Love.',
                content: 'Fall in love and make'
            }
        }
    };

    render() {
        return (
            <div>
                <div className="home_image" />
             <Card content={this.state.card} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(HomeContainer);
