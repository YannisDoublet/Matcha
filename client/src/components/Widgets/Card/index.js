import React from 'react';
import './card.css'

const Card = (props) => {

    const renderCard = (card) => {
        let layout = null;

        let tab = Object.keys(card).map(i => card[i]);
        let type = tab[0];
        tab.splice(0, 1);
        switch (type) {
            case('Home'):
                layout = tab.map((item, i) => (
                    <div className={'card_grid'} key={i}>
                        <div style={{backgroundImage: `url(${item.img})`}}
                             className={'card_img'}/>
                        <div className={'card_content'}>
                            <div className="card_title">
                                {item.title}
                            </div>
                            <div className="card_desc">
                                {item.content}
                            </div>
                        </div>
                    </div>
                ));
                break;
            default:
                layout = null;
                break;
        }
        return layout;
    };

    return (
        <div className="grid_container">
            <div className="content">
                {renderCard(props.content)}
                <div className="vl"/>
            </div>
        </div>
    );
};

export default Card;
