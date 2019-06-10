import React, {Component} from 'react'
import noUiSlider from 'nouislider'
import wNumb from 'wnumb'
import 'nouislider/distribute/nouislider.css'
import '../../../CSS/sliders.css'
import './age_slider.css'

class Age extends Component {

    state = {
        age: []
    };

    updateValue = () => {
        let slider = document.getElementById('age_slider');
        let value = slider.noUiSlider.get();
        this.setState({
            limit: [parseInt(value[0]), parseInt(value[1])]
        }, () => {
            this.props.updateValue('Age', this.state.limit);
        })
    };

    componentDidMount() {
        let handlesSlider = document.getElementById('age_slider');
        noUiSlider.create(handlesSlider, {
            start: [18, 18],
            connect: true,
            tooltips: true,
            format: wNumb({
                decimals: 0,
                postfix: ' years old',
            }),
            range: {
                'min': [18],
                '25%': [30],
                '50%': [50],
                '75%': [75],
                'max': [99]
            },
            pips: {
                mode: 'range',
                density: 3
            }
        });
    }

    render() {
        return (
            <div id={'age_container'}>
                <p id={'title'}>Age</p>
                <div id="age_slider" className="noUiSlider" onMouseUp={this.updateValue}/>
            </div>
        );
    }
}

export default Age;