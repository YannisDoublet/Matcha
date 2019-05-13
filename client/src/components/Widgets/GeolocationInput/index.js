import React, {Component} from 'react'
import Autocomplete from 'react-google-autocomplete'
import './geolocation_input.css'

class GeolocationInput extends Component {

    state = {
        country: '',
        city: '',
        lat: 0,
        lng: 0
    };

    onPlaceSelected = (place) => {
        place.address_components ?
            this.setState({
                country: place.address_components[3].long_name,
                city: place.address_components[0].long_name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }, () => {
                this.props.updateValue('Advanced_geo', this.state);
            }) : this.setState({
                country: '',
                city: '',
                lat: null,
                lng: null
            }, () => {
                this.props.updateValue('Advanced_geo', this.state);
            })
    };

    render() {
        return (
            <div id={'google_map_autocomplete_container'}>
                <i className="fas fa-map-marker-alt"/>
                <Autocomplete
                    id={'google_map_autocomplete'}
                    onPlaceSelected={this.onPlaceSelected}
                    types={['(regions)']}
                    placeholder={'Search a location'}
                    onBlur={this.onPlaceSelected}
                />
            </div>
        );
    }
}

export default GeolocationInput;