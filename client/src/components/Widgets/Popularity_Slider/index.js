import React, {Component} from 'react'
import noUiSlider from 'nouislider'
import wNumb from 'wnumb'
import 'nouislider/distribute/nouislider.css'
import '../../../CSS/sliders.css'
import './popularity_slider.css'

class Popularity extends Component {

    state = {
        age: []
    };

    updateValue = () => {
        let slider = document.getElementById('popularity_slider');
        let value = slider.noUiSlider.get();
        this.setState({
            limit: [parseFloat(value[0]), parseFloat(value[1])]
        }, () => {
            this.props.updateValue('Popularity', this.state.limit);
        })
    };

    componentDidMount() {
        let handlesSlider = document.getElementById('popularity_slider');
        noUiSlider.create(handlesSlider, {
            start: [0, 0],
            connect: true,
            tooltips: true,
            format: wNumb({
                decimals: 2
            }),
            range: {
                'min': [0, 0.25],
                '20%': [1, 0.25],
                '40%': [2, 0.25],
                '60%': [3, 0.25],
                '80%': [4, 0.25],
                'max': [5]
            },
            pips: {
                mode: 'range',
                density: 3
            }
        });
        this.updateValue();
    }

    render() {
        return (
            <div id={'popularity_container'}>
                <p id={'title'}>Popularity</p>
                <div id="popularity_slider" className="noUiSlider" onMouseUp={this.updateValue}/>
            </div>
        );
    }
}

export default Popularity;