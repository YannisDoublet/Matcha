import React, {Component} from 'react';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import {GoogleApiKey} from "../../config/apiKey";

const mapStyles = {
    width: '100%',
    height: '100%'
};

export class MapContainer extends Component {

    state = {
        center: {}
    };

    componentWillMount() {
        this.setState({
            center: {lat: this.props.lat, lng: this.props.lon}
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.lat && nextProps.lon) {
            this.setState({
                center: {lat: nextProps.lat, lng: nextProps.lon}
            })
        }
    }

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={11}
                style={mapStyles}
                initialCenter={this.state.center}
                center={this.state.center}
            >
                <Marker position={{lat: this.props.lat, lng: this.props.lon}}/>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: GoogleApiKey
})(MapContainer);