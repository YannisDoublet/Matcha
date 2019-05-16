import React, {Component} from 'react'
import './sortresult.css'

class SortResult extends Component {

    state = {
        sort: {
            id: 'sort',
            element: 'select',
            type: 'select',
            name: 'sort by',
            options: [
                'Tags',
                'Location',
                'Age',
                'Popularity'
            ],
        },
        order: {
            id: 'order',
            element: 'select',
            type: 'select',
            name: 'order by',
            options: [
                'Ascending',
                'Descending'
            ]
        },
    };

    handleChange = (evt) => {
        let {id, value} = evt.target;
        switch(id) {
            case('sort'):
                this.props.updateValue('Sort', value);
                break;
            case('order'):
                this.props.updateValue('Order', value);
                break;
            default:
                break;
        }
    };

    fetchStateInfo = () => {
        const formArray = Object.keys(this.state).map(key => this.state[key]);
        return formArray.map((item, i) => {
            return (
                this.renderSelect(item, i)
            );
        });
    };

    renderSelect = (item, i) => {
        return (
            <select id={item.id} className={'select'} key={i} onChange={(evt) => this.handleChange(evt)}>
                <option hidden>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</option>
                {item.options ? item.options.map((item, i) => (
                    <option key={i}>{item}</option>
                )) : null}
            </select>
        );
    };


    render() {
        return (
            <div id={'select_container'}>
                {this.fetchStateInfo()}
            </div>
        );
    }
}

export default SortResult;