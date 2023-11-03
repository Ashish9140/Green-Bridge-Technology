import { useContext,useState } from 'react';
import React from 'react'
import { CartContext } from '../CartContext';
import Alert from './Alert';


const VideoWith = () => {
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
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(function (mediaStreamObj) {

                console.log(user);

                // assets
                let videoWithAudio = document.querySelector(".videoWithAudioCtr");
                let recordVideoWith = document.querySelector(".videoWithAudio-sec-btn");
                let videoWithBtn = document.querySelector(".video-rec-withAudio");

                let durationBtn = document.querySelector(".videoWithAudio-duration");

                // buttons
                let videoWithAudioPause = document.getElementById('videoWithAudiobtnPauseReco');
                let videoWithAudioResume = document.getElementById('videoWithAudiobtnResumeReco');
                let videoWithAudioStop = document.getElementById('videoWithAudiobtnStopReco');


                // getting media tracks
                let videoTrackWithAudio = mediaStreamObj.getTracks();
                // Chunk array to store the audio data
                let _recordedChunks = [];
                videoWithAudio.srcObject = mediaStreamObj;
                videoWithBtn.style.display = 'none';
                recordVideoWith.style.display = 'flex';




                // Setup timing
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


                // setup media recorder 
                let mediaRecorder = new MediaRecorder(mediaStreamObj);

                // Start event
                mediaRecorder.start();
                videoWithAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
                videoWithAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
                videoWithAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });

                // If audio data available then push
                // it to the chunk array
                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0)
                        _recordedChunks.push(e.data);
                }
                mediaRecorder.onpause = async () => {
                    videoWithAudioPause.style.display = "none";
                    videoWithAudioResume.style.display = "inline-block";
                    clearInterval(interval);
                };
                mediaRecorder.onresume = async () => {
                    videoWithAudioResume.style.display = "none";
                    videoWithAudioPause.style.display = "inline-block";
                    videoWithAudioStop.style.display = "inline-block";
                    runInterval();
                };

                // Convert the audio data in to blob
                // after stopping the recording
                mediaRecorder.onstop = async function (ev) {
                    videoTrackWithAudio.forEach((track) => {
                        track.stop();
                    });
                    // duration;
                    clearInterval(interval);
                    videoWithBtn.style.display = 'inline-block';
                    recordVideoWith.style.display = 'none';
                    var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
                    let url = window.URL.createObjectURL(blob);
                    // take file input
                    let fileName = prompt("Enter file name", "my-video");

                    // save audio file
                    let date = formatDate();
                    let time = formatTime();

                    clearInterval(intervalLoc);

                    for (let i = 0; i < latitude.length; i++) {
                        latitude[i] = latitude[i].toString();
                    }
                    for (let i = 0; i < longitude.length; i++) {
                        longitude[i] = longitude[i].toString();
                    }




                    const formData = new FormData();
                    formData.append("videowith", blob);
                    formData.append("filename", fileName);
                    formData.append("date", date);
                    formData.append("time", time);

                    // appending location into form data
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

                    fetch(`${baseURL}/videowith`, {
                        method: 'POST',
                        body: formData
                    }).then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                            setAlert(true);
                            setAlertTime(2000);
                        });

                    videoWithAudio.srcObject = null;
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

            .catch(function (err) {
                console.log(err.name, err.message);
            });

    }

    return (
        <div className="videoWithAudio-sec">
            {alert ? <Alert text="File Saved" /> : ""}
            <h3>Video With Audio</h3>
            <div>
                <video autoPlay muted className="videoWithAudioCtr"></video>
            </div>
            <button className="video-rec-withAudio" onClick={handleClick}>Start</button>
            <div className="videoWithAudio-sec-btn">
                <span className="videoWithAudio-duration duration">00:00</span>
                <button id="videoWithAudiobtnPauseReco">Pause</button>
                <button id="videoWithAudiobtnResumeReco" style={{ display: "none" }}>Resume</button>
                <button id="videoWithAudiobtnStopReco">Stop</button>
            </div>
        </div>
    )
}

export default VideoWith