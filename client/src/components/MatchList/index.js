import React, {Component} from 'react'
import ProfileCard from '../Widgets/ProfileCard'
import '../Widgets/ProfileCard/profile_card.css'
import './match_list.css'

class MatchList extends Component {
    render() {
        return (
            <div id={'matchlist_container'}>
              <ProfileCard {...this.props}/>
            </div>
        );
    }
}

export default MatchList;