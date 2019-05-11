import React, {Component} from 'react';
import './inputTag.css'

import Tags from '../Tags'

class InputTag extends Component {

    state = {
        tags: [],
        input_value: '',
        erase_check: false
    };

    handleInput = (evt) => {
        this.setState({
            input_value: evt.target.value
        })
    };

    checkKey = (evt) => {
        console.log(this.state);
        if (evt.key === 'Backspace' && !this.state.input_value && !this.state.erase_check) {
            this.setState({
                erase_check: true
            })
        }
        else if (evt.key === 'Backspace' && this.state.erase_check) {
            this.deleteTag();
        }
    };

    deleteTag = (evt) => {
        let tags = this.state.tags.slice();
        tags.pop();
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
        let newTag = this.state.input_value;
        this.state.input_value.length && this.setState({
            tags: [...tags, newTag],
            input_value: ''
        }, () => {
            this.props.updateValue('Tags', this.state.tags.slice());
        });
    };

    render() {
        let tags = this.state.tags;
        console.log(this.props);
        return (
            <div id={'input_tag_container'}>
                <Tags tags={tags} location={this.props.match.path} delete={this.deleteTag}>
                    <i className="fas fa-search" />
                    <form onSubmit={this.submitTag}>
                        <input id={'input_tag'} type={'text'} value={this.state.input_value} placeholder={'Tags...'} autoFocus={true}
                        onChange={this.handleInput} onKeyUp={this.checkKey}/>
                    </form>
                </Tags>
            </div>
        );
    }
}

export default InputTag;