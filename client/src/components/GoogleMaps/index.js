import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import {GoogleApiKey} from "../../config/apiKey";

const mapStyles = {
    width: '100%',
    height: '100%'
};

export class MapContainer extends Component {
    render() {
        return (
            <Map
                google={this.props.google}
                zoom={11}
                style={mapStyles}
                initialCenter={{
                    lat: 37.37,
                    lng: -122.04
                }}
            />
        );
    }
}

export default GoogleApiWrapper({
    apiKey: GoogleApiKey
})(MapContainer);