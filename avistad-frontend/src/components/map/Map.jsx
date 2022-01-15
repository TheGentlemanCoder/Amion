import React, { StyleSheet } from 'react';
import GoogleMapReact from 'google-map-react';

import './map.css';

const Map = ({ location, zoomLevel }) => (
    <div>
        <div className="google-map">
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyAwu5e4u7rC2HaL_TPqRmU2GZwTOh5IfWs' }}
                defaultCenter={location}
                defaultZoom={zoomLevel}>
            </GoogleMapReact>
        </div>
    </div>
)

export default Map;