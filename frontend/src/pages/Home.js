import { useContext, useState } from 'react';
import { CartContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';

import { getUsers } from '../http';

import TakePhoto from '../components/TakePhoto';
import AudioRecord from '../components/AudioRecord';
import VideoWith from '../components/VideoWith';
import VideoWithout from '../components/VideoWithout';
import ScreenWith from '../components/ScreenWith';
import ScreenWithout from '../components/ScreenWithout';

import Loader from './../components/Loader';
import Alert from '../components/Alert';

const Home = () => {

    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const [alert, setAlert] = useState(false);
    const [value, setvalue] = useState('');
    const { formatDate, formatTime, user, alt, baseURL, auth, setUsers } = useContext(CartContext);
    let latitudeL = [], longitudeL = [], timeStampL = [];
    let latitudeA = [], longitudeA = [], timeStampA = [];



    // other functions
    const handleSS = async () => {
        await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: 'screen',
            }
        }).then(async (mediaStreamObj) => {
            const video = document.querySelector(".snapCtr");
            video.srcObject = mediaStreamObj;
            // const audio = new Audio('/click.mp3');
            let fileName = prompt("Enter file name", "my-image");
            setTimeout(() => {
                // audio.play();
                let canvas = document.createElement('canvas');
                canvas.width = 921;
                canvas.height = 518;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                const img = canvas.toDataURL('image/jpeg')

                let date = formatDate();
                let time = formatTime();
                let lat, long;

                navigator.geolocation.getCurrentPosition(function (pos) {
                    console.log(pos.coords)
                    lat = pos.coords.latitude;
                    long = pos.coords.longitude;

                    let latitude = ['', lat.toString()];
                    let longitude = ['', long.toString()];

                    fetch(`${baseURL}/take-snap`, {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        },
                        body: JSON.stringify({
                            img, filename: fileName, date, time, latitude, longitude, altitude: alt, alias: auth.user.alias,
                            ip: user.ip,
                            iptype: user.iptype,
                            searchname: user.name,
                            searchtype: user.type,
                            searchversion: user.version,
                            devicebrand: user.device.brand,
                            devicetype: user.device.type,
                            devicename: user.device.name,
                            osname: user.os.name,
                            ostype: user.os.type,
                        })
                    }).then((response) => response.json())
                        .then((data) => console.log(data));

                });


                mediaStreamObj.getTracks().forEach((track) => {
                    track.stop();
                });
                video.srcObject = null;

            }, 5000);
        })
    }




    const handleLine = async () => {
        navigator.geolocation.getCurrentPosition(function (pos) {
            let lt = pos.coords.latitude;
            let ln = pos.coords.longitude;
            latitudeL.push(lt.toString());
            longitudeL.push(ln.toString());
            console.log(lt, ln);
            let date = formatDate();
            let time = formatTime();
            timeStampL.push(`${date} ${time}`);
            console.log("Point Captured")
            console.log(latitudeL.length)
            // setvalue(`${latitudeL.length} Line Point Captured`);
            // setAlert(true);
        })
    }
    const handleStop = async () => {
        if (latitudeL.length !== 0) {
            let fileName = prompt("Enter file name", "line-snap");
            let date = formatDate();
            let time = formatTime();

            if (latitudeL.length === 1) {
                latitudeL.unshift('');
                longitudeL.unshift('');
                timeStampL.unshift('');
            }

            fetch(`${baseURL}/geo-snap`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    filename: fileName, date, time, latitude: latitudeL, longitude: longitudeL, alias: auth.user.alias, timestamp: timeStampL,
                    ip: user.ip,
                    filetype: "line snap",
                    iptype: user.iptype,
                    searchname: user.name,
                    searchtype: user.type,
                    searchversion: user.version,
                    devicebrand: user.device.brand,
                    devicetype: user.device.type,
                    devicename: user.device.name,
                    osname: user.os.name,
                    ostype: user.os.type,
                })
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    latitudeL = [];
                    longitudeL = [];
                    timeStampL = [];
                });
        }
    }




    const handleArea = async () => {
        navigator.geolocation.getCurrentPosition(function (pos) {
            let lt = pos.coords.latitude;
            let ln = pos.coords.longitude;
            latitudeA.push(lt.toString());
            longitudeA.push(ln.toString());
            let date = formatDate();
            let time = formatTime();
            timeStampA.push(`${date} ${time}`);
            console.log("Point Captured")
            // setvalue(`${latitudeL.length} Area Point Captured`);
            // setAlert(true);
        })
    }
    const handleStop2 = async () => {
        if (latitudeA.length !== 0) {
            let fileName = prompt("Enter file name", "area-snap");
            latitudeA.push(latitudeA[0]);
            longitudeA.push(longitudeA[0]);
            let date = formatDate();
            let time = formatTime();
            timeStampA.push(`${date} ${time}`);
            fetch(`${baseURL}/geo-snap`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    filename: fileName, date, time, latitude: latitudeA, longitude: longitudeA, alias: auth.user.alias, timestamp: timeStampA,
                    ip: user.ip,
                    filetype: "area snap",
                    iptype: user.iptype,
                    searchname: user.name,
                    searchtype: user.type,
                    searchversion: user.version,
                    devicebrand: user.device.brand,
                    devicetype: user.device.type,
                    devicename: user.device.name,
                    osname: user.os.name,
                    ostype: user.os.type,
                })
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    latitudeA = [];
                    longitudeA = [];
                    timeStampA = [];
                });
        }
    }





    const handleMySnaps = () => {
        navigate("/mysnaps");
    }
    const handleUsers = async () => {
        setLoad(true);
        try {
            const token = JSON.parse(localStorage.getItem("smtoken"));
            // console.log(token);
            if (token !== null) {
                const { data } = await getUsers({ token });
                console.log(data.allAlias);
                setUsers(data.allAlias);
                setLoad(false);
            }
        } catch (err) {
            console.log(err);
        }
        navigate("/adminusers");
    }

    return (
        <div>
            {/* {<div className='alrt'>
                {value}
            </div>} */}
            <div className="container">
                <div className="btns">
                    <img src="images/logo2.png" alt="logo" className='logo' />
                    <p className="alias-code">Alias Code - {auth.user.alias}</p>
                    <button className="ss" onClick={handleSS}>Screenshot</button>
                    <button className="line-snap">Line Snap</button>
                    <div className="snap-box1">
                        <span onClick={handleLine}>Capture</span>
                        <span onClick={handleStop}>Save</span>
                    </div>
                    <button className="area-snap">Area Snap</button>
                    <div className="snap-box1">
                        <span onClick={handleArea}>Capture</span>
                        <span onClick={handleStop2}>Save</span>
                    </div>
                    <button className="alias recording" onClick={handleMySnaps}>My Snaps</button>
                    {auth.isAdmin && <button className="users" onClick={handleUsers}>All Users</button>}
                </div>
                <div className="main-sec">
                    {
                        load ?
                            <Loader />
                            :
                            <>
                                <div className="snap-sec">
                                    <h3>Take Snap</h3>
                                    <div>
                                        <video autoPlay className="snapCtr"></video>
                                    </div>
                                </div>
                                <TakePhoto />
                                <AudioRecord />
                                <VideoWithout />
                                <VideoWith />
                                <ScreenWithout />
                                <ScreenWith />
                            </>
                    }
                </div>
            </div>

            <footer>
                © 2022 THE GREEN BRIDGE Ingenieurgesellschaft mbH
            </footer>
        </div>
    )
}

export default Home