import React, {Component} from 'react'
import ProfileCard from '../Widgets/ProfileCard'
import '../Widgets/ProfileCard/profile_card.css'
import MatchButtons from "../Widgets/MatchButtons"
import './match_list.css'

class MatchList extends Component {

    state = {
        count: 0
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextState.count === 10) {
            this.props.fetchMatch();
            this.setState({
                count: 0
            })
        }
    }

    likeUser = (id, username) => {
        this.props.like(username);
        let card = document.getElementById(`card ${id}`);
        card.classList.add('isLiked');
        setTimeout(() => {
            this.props.users.pop();
            this.setState({
                count: this.state.count + 1
            });
        }, 800)
    };

    dislikeUser = (id, username) => {
        this.props.dislike(username);
        let card = document.getElementById(`card ${id}`);
        card.classList.add('isDisliked');
        setTimeout(() => {
            this.props.users.pop();
            this.setState({
                count: this.state.count + 1
            });
        }, 800)
    };

    render() {
        const users = this.props.users;
        return (
            <div id={'matchlist_container'}>
                {users.map((user, i) => (
                    <div id={`card ${i}`} style={{zIndex: `${i}`}} key={i} className={'match_card_container'}>
                        <ProfileCard {...this.props} user={user} research={this.props.research}/>
                        <MatchButtons username={user.username} like={this.likeUser}
                                      dislike={this.dislikeUser} id={i}/>
                    </div>))}
                <div id={'excuse_message'}>
                    <div id={'pulse'}>
                        <i id='marker' className="fas fa-map-marker-alt"/>
                    </div>
                    <p id={'message'}>No more users in your criteria...</p>
                </div>
            </div>
        );
    }
}

export default MatchList;