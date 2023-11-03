import { aliasData } from "../../http"
import Sidebar from "./Sidebar"
import { useEffect, useContext, useState } from "react";
import { CartContext } from "../../CartContext";
import Loader from "../Loader";

const Screenshot = () => {
    const { auth, baseURL,handlePoint,handleMapLine } = useContext(CartContext);
    const [data, setData] = useState(null);
    const [load, setLoad] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await aliasData({ alias: auth.user.alias, filetype: "take snap" });
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
    return (
        <div>
            <div className="container">
                <Sidebar />
                {
                    (load) ? <Loader />
                        :
                        <div className="main-sec" style={{ display: "inline-block", width: "100%", overflowY: "scroll" }}>

                            {
                                (data !== null) &&
                                    data.map((element, index) => {
                                        return (
                                            <div key={index}>
                                                <div className="minmized-p">
                                                    <a href={`${baseURL}/${element.filepath}`} target="_blank">
                                                        <img src={`${baseURL}/${element.filepath}`} alt="preview" />
                                                    </a>
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
                                                        <div className="preview">
                                                            <a href={`${baseURL}/${element.filepath}`} target="_blank">
                                                                <img src={`${baseURL}/${element.filepath}`} alt="preview" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Latitude</th>
                                                                <th className="iconp">
                                                                    Longitude
                                                                    <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handleMapLine(element.latitude, element.longitude) }} />
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        {
                                                            (element.latitude) &&
                                                                element.latitude.map((item, index) => {
                                                                    // console.log(element)
                                                                    return (
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>{item}</td>
                                                                                <td className="iconp">
                                                                                    {element.longitude[index]}
                                                                                    <img src="/images/map.png" alt="map-icon" className="icon" onClick={() => { handlePoint(item, element.longitude[index]) }} />
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

            <footer>
                © 2022 THE GREEN BRIDGE Ingenieurgesellschaft mbH
            </footer>
        </div>
    )
}

export default Screenshot