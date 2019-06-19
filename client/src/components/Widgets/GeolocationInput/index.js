import React, {Component} from 'react'
import Autocomplete from 'react-google-autocomplete'
import './geolocation_input.css'
import {GoogleApiWrapper} from "google-maps-react";
import {GoogleApiKey} from "../../../config/apiKey";

class GeolocationInput extends Component {

    state = {
        country: '',
        city: '',
        lat: 0,
        lng: 0,
        value: ''
    };

    handleChange = (evt) => {
        this.setState({
            value: evt.target.value
        })
    };

    onPlaceSelected = (place) => {
        if (place.address_components) {
            this.setState({
                country: place.address_components[3].long_name,
                city: place.address_components[0].long_name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                value: place.address_components[0].long_name + ', ' + place.address_components[3].long_name
            }, () => {
                this.props.updateValue('Advanced_geo', this.state);
                this.setState({
                    country: '',
                    city: '',
                    lat: null,
                    lng: null,
                    value: ''
                })
            })
        } else if (!place.address_components && !this.state.value) {
            this.setState({
                country: '',
                city: '',
                lat: null,
                lng: null,
            }, () => {
                this.props.updateValue('Advanced_geo', this.state);
                this.setState({
                    value: ''
                })
            })
        }
    };

    render() {
        return (
            <div id={'google_map_autocomplete_container'}>
                <i className="fas fa-map-marker-alt"/>
                <Autocomplete
                    autoComplete={'disabled'}
                    id={'google_map_autocomplete'}
                    onPlaceSelected={this.onPlaceSelected}
                    types={['(regions)']}
                    placeholder={'Search a location'}
                    onBlur={this.onPlaceSelected}
                    value={this.state.value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: GoogleApiKey
})(GeolocationInput);