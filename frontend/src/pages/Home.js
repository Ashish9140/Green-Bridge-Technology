import { useContext, useState, useRef } from 'react';
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
    const [alert, setAlert] = useState(false);
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const [value, setvalue] = useState('');
    const { formatDate, formatTime, user, alt, baseURL, auth, setUsers } = useContext(CartContext);

    // line capture values
    let latitudeL = useRef([]);
    let longitudeL = useRef([]);
    let timeStampL = useRef([]);


    // line capture values
    let latitudeA = useRef([]);
    let longitudeA = useRef([]);
    let timeStampA = useRef([]);

    const setAlertTime = (time) => {
        setTimeout(() => {
          setAlert(false);
        }, time);
      }


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
                        .then((data) => {
                            console.log(data);
                            //setvalue(`File Saved`);
                            setAlert(true);
                            setAlertTime(2000);
                        });

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
            latitudeL.current.push(lt.toString());
            longitudeL.current.push(ln.toString());
            // console.log(lt, ln);
            let date = formatDate();
            let time = formatTime();
            timeStampL.current.push(`${date} ${time}`);
            console.log("Point Captured")
            console.log(latitudeL.current.length)
            setvalue(`${latitudeL.current.length} Line Point Captured`);
            setAlert(true);
            setAlertTime(3000);
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
                    filename: fileName, date, time, latitude: latitudeL.current, longitude: longitudeL.current, alias: auth.user.alias, timestamp: timeStampL.current,
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
                    latitudeL.current = [];
                    longitudeL.current = [];
                    timeStampL.current = [];
                    setvalue(`File Saved`);
                    setAlert(true);
                    setAlertTime(2000);
                });
        } else {
            console.log("Nothing is captured");
        }
    }
    const handleArea = async () => {
        navigator.geolocation.getCurrentPosition(function (pos) {
            let lt = pos.coords.latitude;
            let ln = pos.coords.longitude;
            latitudeA.current.push(lt.toString());
            longitudeA.current.push(ln.toString());
            let date = formatDate();
            let time = formatTime();
            timeStampA.current.push(`${date} ${time}`);
            console.log("Point Captured")
            setvalue(`${latitudeA.current.length} Area Point Captured`);
            setAlert(true);
            setAlertTime(3000);
        })
    }
    const handleStop2 = async () => {
        if (latitudeA.length !== 0) {
            let fileName = prompt("Enter file name", "area-snap");
            latitudeA.current.push(latitudeA.current[0]);
            longitudeA.current.push(longitudeA.current[0]);
            let date = formatDate();
            let time = formatTime();
            timeStampA.current.push(`${date} ${time}`);
            fetch(`${baseURL}/geo-snap`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    filename: fileName, date, time, latitude: latitudeA.current, longitude: longitudeA.current, alias: auth.user.alias, timestamp: timeStampA.current,
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
                    latitudeA.current = [];
                    longitudeA.current = [];
                    timeStampA.current = [];
                    setvalue(`File Saved`);
                    setAlert(true);
                    setAlertTime(2000);
                });
        } else {
            console.log("Nothing is captured");
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
            {alert ? <Alert text={value} /> : ""}
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