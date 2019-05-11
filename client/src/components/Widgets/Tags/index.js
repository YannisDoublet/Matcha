import React from 'react';
import './tags.css'

const Tags = (props) => {
    const renderTags = (tags) => {
        return tags.map((tag, i) => (
            <div key={i} className={'tag'} onClick={props.delete}>
                <span>{tag}</span>
            </div>
        ));
    };

    return (
        <div id={'tags_container'}>
            {props.location === '/match' && props.children[0]}
            {renderTags(props.tags)}
            {props.location === '/match' &&  props.children[1]}
        </div>
    );
};

export default Tags;
