import React, {Component} from 'react'
import './sortresult.css'

class SortResult extends Component {

    state = {
        sort: {
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
            element: 'select',
            type: 'select',
            name: 'order by',
            options: [
                'Ascending',
                'Descending'
            ]
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
            <select className={'select'} key={i}>
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