import React, { useEffect, useContext, useState } from "react";
import { CartContext } from "../CartContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
    const { targetpoint} = useContext(CartContext);
    const [map, setMap] = useState(null);
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        const latitude = parseFloat(targetpoint.latitude);
        const longitude = parseFloat(targetpoint.longitude);
        if (!map) {
            const osmMap = L.map("map").setView([latitude, longitude], 18);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 40,
            }).addTo(osmMap);
            setMap(osmMap);
        } else {
            map.setView([latitude, longitude], 20);
        }
    }, [targetpoint, map]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const userLocation = { latitude: userLat, longitude: userLng };

                const customIcon = L.divIcon({
                    className: "custom-marker",
                    html: `<div class="marker-label">${2}</div>`,
                    iconSize: [30, 30],
                });

                if (map) {
                    if (map.userMarker) {
                        map.userMarker.setLatLng([userLat, userLng]);
                        map.userMarker.getPopup().setContent(`Current Point: ${userLat}, ${userLng}`);
                    } else {
                        const userMarker = L.marker([userLat, userLng], {
                            icon: L.divIcon({
                                className: "custom-marker",
                                html: `<div class="marker-label">${2}</div>`,
                                iconSize: [30, 30],
                            }),
                        }).addTo(map);
                        userMarker.bindPopup(`Current Point: ${userLat}, ${userLng}`).openPopup();
                        map.userMarker = userMarker;
                    }

                    const targetLat = parseFloat(targetpoint.latitude);
                    const targetLng = parseFloat(targetpoint.longitude);
                    const targetLocation = { latitude: targetLat, longitude: targetLng };


                    const radian = Math.PI / 180;

                    const dLat = (targetLat - userLat) * radian;
                    const dLng = (targetLng - userLng) * radian;

                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(userLat * radian) * Math.cos(targetLat * radian) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);

                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                    const earthRadius = 6371; // Earth's radius in kilometers (mean value)
                    const distanceInKilometers = earthRadius * c;
                    const distanceInMeters = distanceInKilometers * 1000; // Convert to meters

                    let formattedDistance;

                    if (distanceInMeters > 1000) {
                        const distanceInKilometers = (distanceInMeters / 1000).toFixed(2); // Convert to kilometers and round to 2 decimal places
                        formattedDistance = `${distanceInKilometers} kilometer`;
                    } else {
                        formattedDistance = `${Math.round(distanceInMeters)} meter`;
                    }

                    setDistance(formattedDistance);

                    if (map.targetMarker) {
                        map.targetMarker.setLatLng([targetLat, targetLng]);
                        map.targetMarker.getPopup().setContent(`Target Point: ${targetLat}, ${targetLng}`);
                    } else {
                        const targetMarker = L.marker([targetLat, targetLng], {
                            icon: L.divIcon({
                                className: "custom-marker",
                                html: `<div class="marker-label">${1}</div>`,
                                iconSize: [30, 30],
                            }),
                        }).addTo(map);
                        targetMarker.bindPopup(`Target Point: ${targetLat}, ${targetLng}`).openPopup();
                        map.targetMarker = targetMarker;
                    }

                    if (map.line) {
                        map.removeLayer(map.line);
                    }

                    const line = L.polyline(
                        [
                            [userLat, userLng],
                            [targetLat, targetLng],
                        ],
                        {
                            color: "blue",
                        }
                    );

                    line.addTo(map);
                    map.line = line;
                }
            });
        }
    }, [map, targetpoint]);

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
            <span className="dist">{distance}</span>
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
                .dist{
                    background-color: #007bff;
                    color: #fff;
                    padding: 2px;
                }
                `}
            </style>
        </div>
    );
};

export default Map;
