import React, { useEffect, useContext, useState, useRef } from "react";
import { CartContext } from "../CartContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapLine = () => {
    const { coordinates } = useContext(CartContext);
    const [map, setMap] = useState(null);
    const markersRef = useRef([]);

    // Function to update markers based on new coordinates
    const updateMarkers = () => {
        if (map) {
            markersRef.current.forEach((marker) => {
                map.removeLayer(marker);
            });

            markersRef.current = coordinates.map((point, index) => {
                const pointLatitude = parseFloat(point.lat);
                const pointLongitude = parseFloat(point.lng);

                if (!isNaN(pointLatitude) && !isNaN(pointLongitude)) {
                    const customIcon = L.divIcon({
                        className: "custom-marker",
                        html: `<div class="marker-label">${index + 1}</div>`,
                        iconSize: [30, 30],
                    });

                    const marker = L.marker([pointLatitude, pointLongitude], {
                        icon: customIcon,
                    });
                    marker.addTo(map);
                    return marker;
                } else {
                    console.error(`Invalid coordinates for point: ${JSON.stringify(point)}`);
                    return null;
                }
            });
        }
    };

    useEffect(() => {
        if (!map && Array.isArray(coordinates) && coordinates.length > 0) {
            const firstPoint = coordinates[0];
            const latitude = parseFloat(firstPoint.lat);
            const longitude = parseFloat(firstPoint.lng);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                const osmMap = L.map("map").setView([latitude, longitude], 18);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 40,
                }).addTo(osmMap);

                setMap(osmMap);
            } else {
                console.error(`Invalid coordinates for first point: ${JSON.stringify(firstPoint)}`);
            }
        }
    }, [coordinates, map]);

    useEffect(() => {
        if (map) {
            updateMarkers(); // Update markers when coordinates change
        }
    }, [coordinates, map]);

    useEffect(() => {
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [map]);

    return (
        <div>
            <div id="map" style={{ height: "600px", width: "400px" }}></div>
            <style>
                {`
                .custom-marker {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #007bff;
                    color: #fff;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                }
                .marker-label {
                    font-size: 14px;
                    font-weight: bold;
                }
                `}
            </style>
        </div>
    );
};

export default MapLine;
