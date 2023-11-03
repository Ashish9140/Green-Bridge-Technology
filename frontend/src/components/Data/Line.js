import { aliasData } from "../../http"
import Sidebar from "./Sidebar"
import { useEffect, useContext, useState } from "react";
import { CartContext } from "../../CartContext";
import Loader from "../Loader";
import Map from "../Map";
import MapLine from "../MapLine";

const Line = () => {
    const { auth, setTargetpoint, setCoordinates, handlePoint, handleMapLine } = useContext(CartContext);
    const [data, setData] = useState(null);
    const [load, setLoad] = useState(true);

    const [mapLine, setMapLine] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await aliasData({ alias: auth.user.alias, filetype: "line snap" });
                // console.log(data.rows);
                setData(data.rows);
                setLoad(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const handleClick = (e, index) => {
        if (e.target.innerHTML === "Details") {
            document.querySelector(`.control${index}`).style.display = "block";
            e.target.innerHTML = "Hide";
        } else {
            document.querySelector(`.control${index}`).style.display = "none";
            e.target.innerHTML = "Details";
        }
    }

    const handleHoverClick = (element, latitude, longitude) => {
        setTargetpoint({ latitude, longitude });
        setMapLine(false);
        // console.log(element, latitude, longitude);
    }

    const handleLine = (latitude, longitude) => {
        let prevLat = '';
        let prevLng = '';
        const newCoordinates = latitude.map((lat, index) => {
            if (lat === '' || lat === prevLat || longitude[index] === prevLng) {
                return null;
            }
            prevLat = lat;
            prevLng = longitude[index];
            return {
                lat: lat,
                lng: longitude[index],
            };
        }).filter((coord) => coord !== null);
        setCoordinates(newCoordinates);
        setMapLine(true);
    }



    return (
        <div>
            <div className="mapDiv">
                <div className="container container2">
                    <Sidebar />
                    {(load) ? <Loader />
                        :
                        <div className="main-sec" style={{ display: "inline-block", width: "100%", overflowY: "scroll" }}>

                            {
                                (data !== null) &&
                                    data.map((element, index) => {
                                        return (
                                            <div key={index}>
                                                <div className="minmized-p">
                                                    <img src="/images/line.jpeg" alt="preview" />
                                                    <span>{element.filename}</span>
                                                    <span>{element.date}</span>
                                                    <button onClick={(e) => { handleClick(e, index) }}>Details</button>
                                                </div>
                                                <div className={`card control${index}`}>
                                                    <div className="preview-box">
                                                        <div className="cardInfo">
                                                            <p><span className="bold">Filename : </span>{element.filename}</p>
                                                            <p><span className="bold">Timestamp : </span>[ Date : {element.date} , Time : {element.time} ]</p>
                                                            <p><span className="bold">IP : </span>[ Address : {element.ip} , Type : {element.iptype} ]</p>
                                                            <p><span className="bold">Device : </span>[ Brand : {element.devicename} , Name : {element.devicetype} ]</p>
                                                        </div>
                                                    </div>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Latitude</th>
                                                                <th>Longitude</th>
                                                                <th>Timestamp</th>
                                                                <th className="iconp">
                                                                    Altitude(in Meter)
                                                                    <div>
                                                                        <img src="/images/compass.png" alt="map-icon" className="icon" onClick={() => { handleLine(element.latitude, element.longitude) }} />
                                                                        <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handleMapLine(element.latitude, element.longitude) }} />
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        {
                                                            (element.latitude) &&
                                                                element.latitude.map((item, index) => {
                                                                    if (item !== '')
                                                                        return (
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>{item}</td>
                                                                                    <td>{element.longitude[index]}</td>
                                                                                    <td>{element.timestamp[index]}</td>
                                                                                    <td className="iconp">
                                                                                        {
                                                                                            (element.altitude) ?
                                                                                                element.altitude[index]
                                                                                                :
                                                                                                "no data"
                                                                                        }
                                                                                        <div>
                                                                                            <img src="/images/compass.png" alt="map-icon" className="icon" onClick={(e) => { handleHoverClick(e.target, item, element.longitude[index]) }} />
                                                                                            <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handlePoint(item, element.longitude[index]) }} />
                                                                                        </div>
                                                                                    </td>

                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                })
                                                        }
                                                    </table>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    }
                </div>
                {
                    mapLine ?
                        <MapLine />
                        :
                        <Map />
                }
            </div>

            <footer>
                © 2022 THE GREEN BRIDGE Ingenieurgesellschaft mbH
            </footer>
        </div>
    )
}

export default Line