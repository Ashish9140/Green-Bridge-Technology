import { useContext,useState } from 'react';
import React from 'react'
import { CartContext } from '../CartContext';
import Alert from './Alert';

const ScreenWithout = () => {
    const [alert, setAlert] = useState(false);
    const { auth, formatDate, formatTime, user, baseURL } = useContext(CartContext);


    let duration = 0;
    let interval, intervalLoc;

    const setAlertTime = (time) => {
        setTimeout(() => {
            setAlert(false);
        }, time);
    }

    const handleClick = async () => {
        await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: 'screen',
            }
        }).then(async (mediaStreamObj) => {

            // assets
            let screenWithoutAudio = document.querySelector(".screenWithoutAudioCtr");
            let recordScreenWithout = document.querySelector(".screenWithoutAudio-sec-btn");
            let screenWithoutBtn = document.querySelector(".screen-rec-withoutAudio");
            let durationBtn = document.querySelector(".screenWithoutAudio-duration");

            // buttons
            let screenWithoutAudioPause = document.getElementById('screenWithoutAudiobtnPauseReco');
            let screenWithoutAudioResume = document.getElementById('screenWithoutAudiobtnResumeReco');
            let screenWithoutAudioStop = document.getElementById('screenWithoutAudiobtnStopReco');

            // starting actions of buttons
            screenWithoutAudioResume.style.display = "none";
            screenWithoutAudioPause.style.display = "inline-block";
            screenWithoutAudioStop.style.display = "inline-block";

            // Chunk array to store the audio data
            let _recordedChunks = [];
            screenWithoutAudio.srcObject = mediaStreamObj;
            screenWithoutBtn.style.display = "none";
            recordScreenWithout.style.display = "flex";

            // getting media tracks
            let screenTrackWithoutAudio = mediaStreamObj.getTracks();

            // setup media recorder 
            let mediaRecorder = new MediaRecorder(mediaStreamObj);

            // setting time
            durationBtn.innerHTML = '00:00';
            duration = 0;
            runInterval();

            let latitude = [], longitude = [];

            intervalLoc = setInterval(() => {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    let size = latitude.length;
                    let lt = pos.coords.latitude;
                    let ln = pos.coords.longitude;
                    console.log(lt, ln);
                    if (size !== 0) {
                        if (Math.abs(lt - latitude[size - 1]) > 0.0001 || Math.abs(ln - longitude[size - 1]) > 0.0001) {
                            latitude.push(lt);
                            longitude.push(ln);
                        }
                    } else {
                        latitude.push(lt);
                        longitude.push(ln);
                    }
                })
            }, 2000);

            // Start event
            mediaRecorder.start();
            screenWithoutAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
            screenWithoutAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
            screenWithoutAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });

            // If audio data available then push
            // it to the chunk array
            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0)
                    _recordedChunks.push(e.data);
            }
            mediaRecorder.onpause = async () => {
                screenWithoutAudioPause.style.display = "none";
                screenWithoutAudioResume.style.display = "inline-block";
                clearInterval(interval);
            };
            mediaRecorder.onresume = async () => {
                screenWithoutAudioResume.style.display = "none";
                screenWithoutAudioPause.style.display = "inline-block";
                screenWithoutAudioStop.style.display = "inline-block";
                runInterval();
            };

            // Convert the audio data in to blob
            // after stopping the recording
            mediaRecorder.onstop = async function (ev) {
                screenTrackWithoutAudio.forEach((track) => {
                    track.stop();
                });
                clearInterval(interval);
                screenWithoutBtn.style.display = "inline-block";
                recordScreenWithout.style.display = "none";
                var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
                let url = window.URL.createObjectURL(blob);
                // take file input
                let fileName = prompt("Enter file name", "my-screen");

                // save file
                let date = formatDate();
                let time = formatTime();

                clearInterval(intervalLoc);

                for (let i = 0; i < latitude.length; i++) {
                    latitude[i] = latitude[i].toString();
                }
                for (let i = 0; i < longitude.length; i++) {
                    // console.log(latitude[i]);
                    longitude[i] = longitude[i].toString();
                }

                const formData = new FormData();
                formData.append("screenwithout", blob);
                formData.append("filename", fileName);
                formData.append("date", date);
                formData.append("time", time);

                if (latitude.length === 1) {
                    formData.append('latitude', '');
                }
                latitude.forEach((latitude, index) => {
                    formData.append('latitude', latitude);
                });


                if (latitude.length === 1) {
                    formData.append("longitude", '');
                }
                longitude.forEach((longitude, index) => {
                    formData.append("longitude", longitude);
                });

                formData.append("duration", duration);
                formData.append("alias", auth.user.alias);

                formData.append("ip", user.ip);
                formData.append("iptype", user.iptype);
                formData.append("devicebrand", user.device.brand);
                formData.append("devicename", user.device.name);
                formData.append("devicetype", user.device.type);
                formData.append("searchname", user.name);
                formData.append("searchtype", user.type);
                formData.append("searchversion", user.version);
                formData.append("osname", user.os.name);
                formData.append("ostype", user.os.type);

                fetch(`${baseURL}/screenwithout`, {
                    method: 'POST',
                    body: formData
                }).then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        setAlert(true);
                        setAlertTime(2000);
                    });

                screenWithoutAudio.srcObject = null;
            }

            function runInterval() {
                interval = setInterval(() => {
                    duration++;
                    if (duration < 10)
                        durationBtn.innerHTML = `00:0${duration}`;
                    else if (duration < 60)
                        durationBtn.innerHTML = `00:${duration}`;
                    else
                        durationBtn.innerHTML = `0${duration / 60}:${duration % 60}`;

                }, 1000);
            }
        })
            // If any error occurs then handles the error
            .catch(function (err) {
                console.log(err.name, err.message);

            });
    }

    return (
        <div className="screenWithoutAudio-sec">
            {alert ? <Alert text="File Saved" /> : ""}
            <h3>Screen Without Audio</h3>
            <div>
                <video autoPlay muted className="screenWithoutAudioCtr"></video>
            </div>
            <button className="screen-rec-withoutAudio" onClick={handleClick}>Start</button>
            <div className="screenWithoutAudio-sec-btn">
                <span className="screenWithoutAudio-duration duration">00:00</span>
                <button id="screenWithoutAudiobtnPauseReco">Pause</button>
                <button id="screenWithoutAudiobtnResumeReco" style={{ display: "none" }}>Resume</button>
                <button id="screenWithoutAudiobtnStopReco">Stop</button>
            </div>
        </div>
    )
}

export default ScreenWithout