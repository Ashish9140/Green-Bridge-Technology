import { useContext,useState } from 'react';
import React from 'react'
import { CartContext } from '../CartContext';
import Alert from './Alert';

const TakePhoto = () => {
    const [alert, setAlert] = useState(false);
    const { formatDate, formatTime, user, baseURL, auth, alt} = useContext(CartContext);

    const setAlertTime = (time) => {
        setTimeout(() => {
            setAlert(false);
        }, time);
    }
    // Navigator video stream
    const handleClick = async () => {
        try {

            const stream = await navigator.mediaDevices.
                getUserMedia({
                    video: {
                        optional: [
                            { minWidth: 320 },
                            { minWidth: 640 },
                            { minWidth: 800 },
                            { minWidth: 900 },
                            { minWidth: 1024 },
                            { minWidth: 1280 },
                            { minWidth: 1920 },
                            { minWidth: 2560 }
                        ]
                    },
                    audio: false
                });

            let video = document.querySelector(".ssCtr");
            let takePhoto = document.querySelector('.take-ss');
            let ssSave = document.querySelector('.ss-save');

            let ssTracks = stream.getTracks();

            // set video source
            video.srcObject = stream;
            takePhoto.style.display = "none";
            ssSave.style.display = "inline-block";

            // take a picture on K press
            document.querySelector('.ss-save').addEventListener('click', async () => {
                takePhoto.style.display = "inline-block";
                ssSave.style.display = "none";
                let canvas = document.createElement('canvas');
                // set canvas width and height
                canvas.width = 850;
                canvas.height = 638;
                // Draw a new image
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                // Take a shot
                let img = canvas.toDataURL('image/jpeg');
                // take the file name
                let fileName = prompt("Enter file name", "my-image");

                let date = formatDate();
                let time = formatTime();
                let lat, long;

                navigator.geolocation.getCurrentPosition(function (pos) {
                    console.log(pos.coords)
                    lat = pos.coords.latitude;
                    long = pos.coords.longitude;

                    let latitude = ['', lat.toString()];
                    let longitude = ['', long.toString()];

                    fetch(`${baseURL}/take-photo`, {
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
                            setAlert(true);
                            setAlertTime(2000);
                        });
                });

                ssTracks.forEach((track) => {
                    track.stop();
                });
                video.srcObject = null;
            })

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="ss-sec">
            {alert ? <Alert text="File Saved" /> : ""}
            <h3>Take Photo</h3>
            <div>
                <video autoPlay className="ssCtr"></video>
            </div>
            <div>
                <button className="take-ss" onClick={handleClick}>Start</button>
                <button className="ss-save" style={{ display: "none" }}>Click</button>
            </div>
        </div>
    )
}

export default TakePhoto