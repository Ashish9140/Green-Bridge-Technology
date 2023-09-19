import { useEffect, useContext, useState } from "react";
import { CartContext } from "../CartContext";

const GMap = () => {
    const { targetpoint } = useContext(CartContext);
    const [map, setMap] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
        // Initialize the map
        const googleMap = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: targetpoint.latitude, lng: targetpoint.longitude },
            zoom: 8,
        });
        setMap(googleMap);

        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(latitude, longitude);
                setCurrentPosition({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error('Error getting current location:', error);
            }
        );
    }, [targetpoint.latitude, targetpoint.longitude]);

    useEffect(() => {
        if (map && currentPosition && targetpoint.latitude && targetpoint.longitude) {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer({
                map: map,
            });

            const origin = new window.google.maps.LatLng(currentPosition.lat, currentPosition.lng);
            const destination = new window.google.maps.LatLng(targetpoint.latitude, targetpoint.longitude);

            // Request driving directions
            const request = {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                } else {
                    console.error('Directions request failed:', status);
                }
            });
        }
    }, [map, currentPosition, targetpoint.latitude, targetpoint.longitude]);

    return (
        <div>
            <div id="map" style={{ height: "600px", width: "400px" }}></div>
        </div>
    );
};

export default GMap;
