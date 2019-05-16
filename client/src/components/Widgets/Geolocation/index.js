import React, {Component} from 'react'
import noUiSlider from 'nouislider'
import wNumb from 'wnumb'
import 'nouislider/distribute/nouislider.css'
import '../../../CSS/sliders.css'
import './geolocation.css'

/* Géolocaliser la personne soit par autorisation soit par IP*/

class Geolocation extends Component {

    state = {
        limit: []
    };

    updateValue = () => {
        let slider = document.getElementById('slider');
        let value = slider.noUiSlider.get();
        this.setState({
            limit: [parseInt(value[0]), parseInt(value[1])]
        }, () => {
            this.props.updateValue('Geo', this.state.limit);
        })
    };

    componentDidMount() {
        let handlesSlider = document.getElementById('slider');
        noUiSlider.create(handlesSlider, {
            start: [0, 0],
            connect: true,
            tooltips: true,
            format: wNumb({
                decimals: 0,
                postfix: ' km'
            }),
            range: {
                'min': [0],
                '25%': [50, 5],
                '60%': [125, 25],
                '85%': [250, 50],
                'max': [500]
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
            <div id={'geolocation_container'}>
                <p id={'title'}>Distance</p>
                <div id="slider" className="noUiSlider" onMouseUp={this.updateValue}/>
            </div>
        );
    }
}

export default Geolocation;