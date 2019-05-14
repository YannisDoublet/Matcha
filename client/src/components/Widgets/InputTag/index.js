import React, {Component, Fragment} from 'react';
import './inputTag.css'

import Tags from '../Tags'

class InputTag extends Component {

    state = {
        tags: [],
        input_value: '',
        suggestions: [
            'Funny',
            'Fun',
            'Romantic',
            'Weird',
            'React',
            'Arnaud',
            'Tanguy',
            'Shana',
            'Yannis',
            '42'
        ],
        filtered: [],
        activeSuggestion: 0,
        showSuggestion: false,
        erase_check: false
    };

    handleInput = (evt) => {
        this.setState({
            input_value: evt.target.value,
            erase_check: false
        }, () => {
            this.handleAutoComplete(this.state.input_value, this.state.suggestions);
        });
    };

    handleAutoComplete = (value, suggestions) => {
        if (value.length > 0) {
            const filteredSuggestions = suggestions.filter(suggestion =>
                suggestion.indexOf(value.charAt(0).toUpperCase() + value.slice(1)) === 0);
            this.setState({
                filtered: filteredSuggestions,
                activeSuggestion: 0,
                showSuggestion: true
            })
        } else {
            this.setState({
                filtered: [],
                activeSuggestion: 0,
                showSuggestion: false
            })
        }
    };

    renderAutoComplete = (filtered) => {
        let tags = this.state.tags;
        return (
            <div id={'autocomplete_container'}>
                {filtered.map((item, i) => {
                    let active = i === this.state.activeSuggestion ? 'suggestion-active' : 'suggestion';
                    return (
                        tags.indexOf(item) === -1 ? <div key={i} className={active}>{item}</div> : null
                    )
                })}
            </div>
        )
    };

    checkKey = (evt) => {
        if (evt.key === 'Backspace' && !this.state.input_value && !this.state.erase_check) {
            this.setState({
                erase_check: true
            })
        } else if (evt.key === 'Backspace' && this.state.erase_check) {
            this.deleteTag();
        } else if (evt.key === 'ArrowUp') {
            if (this.state.activeSuggestion === 0) {
                return;
            }
            this.setState({activeSuggestion: this.state.activeSuggestion - 1});
        } else if (evt.key === 'ArrowDown') {
            if (this.state.activeSuggestion + 1 === this.state.filtered.length) {
                return;
            }
            this.setState({activeSuggestion: this.state.activeSuggestion + 1});
        }
    };

    checkTags = (newTag, tags) => {
        return tags.indexOf(newTag)
    };

    deleteTag = (evt) => {
        let tags = this.state.tags.slice();
        evt ? tags.splice(evt.target.id, 1) : tags.pop();
        this.setState({
            tags: tags,
            erase_check: false
        }, () => {
            this.props.deleteValue('Tags', this.state.tags.slice())
        })
    };

    submitTag = (evt) => {
        evt.preventDefault();
        let tags = this.state.tags.slice();
        let newTag = this.state.filtered[this.state.activeSuggestion] ?
            this.state.filtered[this.state.activeSuggestion] : null;
        if (newTag && newTag.length > 0) {
            if (this.checkTags(newTag, tags) === -1 && this.props.match.path === '/match') {
                this.state.input_value.length && this.setState({
                    tags: [...tags, newTag],
                    input_value: '',
                    filtered: [],
                    activeSuggestion: 0,
                    showSuggestion: false
                }, () => {
                    this.props.updateValue('Tags', this.state.tags.slice());
                });
            }
        }
    };

    render() {
        let tags = this.state.tags;
        let filtered = this.state.filtered;
        let autoComplete = this.renderAutoComplete(filtered);
        return (
            <div id={'input_tag_container'}>
                <Tags tags={tags} location={this.props.match.path} delete={this.deleteTag} id={'searchbar'}>
                    <i className="fas fa-search"/>
                    <form id='form_container' onSubmit={this.submitTag}>
                        <input id={'input_tag'} type={'text'} value={this.state.input_value} placeholder={'Tags...'}
                               autoFocus={true}
                               onChange={this.handleInput} onKeyUp={this.checkKey}
                               autoComplete={"off"}/>
                        <Fragment>
                            {autoComplete}
                        </Fragment>
                    </form>
                </Tags>
            </div>
        );
    }
}

export default InputTag;