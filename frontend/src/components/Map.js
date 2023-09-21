import React, { useEffect, useContext, useState, useRef } from "react";
import { CartContext } from "../CartContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const OSMMap = () => {
    const { targetpoint } = useContext(CartContext);
    const [map, setMap] = useState(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const latitude = parseFloat(targetpoint.latitude);
        const longitude = parseFloat(targetpoint.longitude);

        if (!map) {
            const osmMap = L.map('map').setView([latitude, longitude], 18);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 40,
            }).addTo(osmMap);

            setMap(osmMap);

            const customIcon = L.icon({
                iconUrl: "/images/marker.png",
                iconSize: [50, 50],
                iconAnchor: [16, 32],
            });

            const targetMarker = L.marker([latitude, longitude], { icon: customIcon });
            markerRef.current = targetMarker;

            targetMarker.addTo(osmMap);

        } else {
            map.setView([latitude, longitude], 18);

            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            } else {
                const customIcon = L.icon({
                    iconUrl: "/images/marker.png",
                    iconSize: [50, 50],
                    iconAnchor: [16, 32],
                });

                const targetMarker = L.marker([latitude, longitude], { icon: customIcon });
                markerRef.current = targetMarker;
                targetMarker.addTo(map);
            }
        }
    }, [targetpoint, map]);

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
        </div>
    );
};

export default OSMMap;
