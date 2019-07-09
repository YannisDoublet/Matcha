import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {fetchTags} from '../../../actions/matchActions'
import Tags from '../Tags'
import './inputTag.css'

class InputTag extends Component {

    state = {
        tags: [],
        input_value: '',
        suggestions: [],
        filtered: [],
        activeSuggestion: 0,
        showSuggestion: false,
        erase_check: false
    };


    componentDidMount() {
        this.props.dispatch(fetchTags());
    }

    handleInput = (evt) => {
        this.setState({
            input_value: evt.target.value,
            erase_check: false
        }, () => {
            this.handleAutoComplete(this.state.input_value, this.props.tags);
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
        if (this.props.id === 'searchbar') {
            let tags = this.state.tags.slice();
            evt ? tags.splice(evt.target.id, 1) : tags.pop();
            this.setState({
                tags: tags,
                erase_check: false
            }, () => {
                if (this.props.id === 'searchbar') {
                    this.props.deleteValue('Tags', this.state.tags.slice())
                } else {
                    return null;
                }
            })
        } else if (this.props.id === 'myProfile') {
            console.log(evt.target.value);
        }

    };

    submitTag = (evt) => {
        evt.preventDefault();
        if (this.props.id === 'searchbar') {
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
        } else if (this.props.id === 'myProfile') {
            let mytags = this.props.mytags.slice();
            let newTag = this.state.filtered[this.state.activeSuggestion] ?
                this.state.filtered[this.state.activeSuggestion] : this.state.input_value;
            if (newTag && newTag.length > 0) {
                if (this.checkTags(newTag, mytags) === -1) {
                    this.props.addTag(newTag);
                }
            }
        }
    };

    render() {
        let tags = this.state.tags;
        let filtered = this.state.filtered;
        let autoComplete = this.renderAutoComplete(filtered);
        return (
            <div id={'input_tag_container'}>
                <Tags tags={tags} location={this.props.match.path} delete={this.deleteTag} id={this.props.id}>
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

function mapStateToProps(state) {
    let tags = state.match.tags;
    return {
        tags
    };
}

export default connect(mapStateToProps)(InputTag);