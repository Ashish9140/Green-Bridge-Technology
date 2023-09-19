import React, { useEffect, useContext, useState, useRef } from "react";
import { CartContext } from "../CartContext";

const MapLine = () => {
    const { coordinates } = useContext(CartContext);
    const numericCoordinates = coordinates.map(coord => ({
        lat: parseFloat(coord.lat),
        lng: parseFloat(coord.lng)
    }));
    const mapRef = useRef(null);
    const polylineRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || numericCoordinates.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        numericCoordinates.forEach((coordinate) => {
            bounds.extend(new window.google.maps.LatLng(coordinate.lat, coordinate.lng));
        });

        const centerLat = bounds.getCenter().lat();
        const centerLng = bounds.getCenter().lng();

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: centerLat, lng: centerLng },
            zoom: 20,
        });

        numericCoordinates.forEach((coordinate, index) => {
            new window.google.maps.Marker({
                position: { lat: coordinate.lat, lng: coordinate.lng },
                map: map,
                label: `${index + 1}`,
            });
        });

        polylineRef.current = new window.google.maps.Polyline({
            path: numericCoordinates,
            geodesic: true,
            strokeColor: "#0000FF",
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });

        polylineRef.current.setMap(map);
    }, [numericCoordinates]);

    return <div ref={mapRef} style={{ height: "600px", width: "400px" }} />;
};

export default MapLine;
