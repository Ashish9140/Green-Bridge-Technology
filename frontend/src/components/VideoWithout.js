import { useContext ,useState} from 'react';
import React from 'react'
import { CartContext } from '../CartContext';
import Alert from './Alert';

const VideoWithout = () => {
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
        await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
            .then(function (mediaStreamObj) {


                // assets
                let videoWithoutAudio = document.querySelector(".videoWithoutAudioCtr");
                let recordVideoWithout = document.querySelector(".videoWithoutAudio-sec-btn");
                let videoWithoutBtn = document.querySelector(".video-rec-withoutAudio");
                let durationBtn = document.querySelector(".videoWithoutAudio-duration");

                // buttons
                let videoPause = document.getElementById('videoWithoutAudiobtnPauseReco');
                let videoResume = document.getElementById('videoWithoutAudiobtnResumeReco');
                let videoStop = document.getElementById('videoWithoutAudiobtnStopReco');

                videoResume.style.display = "none";
                videoPause.style.display = "inline-block";
                videoStop.style.display = "inline-block";

                // getting media tracks
                let videoTrackWithoutAudio = mediaStreamObj.getTracks();
                // Chunk array to store the audio data
                let _recordedChunks = [];
                videoWithoutAudio.srcObject = mediaStreamObj;
                videoWithoutBtn.style.display = "none";
                recordVideoWithout.style.display = "flex";

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
                        // console.log(lt, ln);
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
                videoPause.addEventListener('click', () => { mediaRecorder.pause(); });
                videoResume.addEventListener('click', () => { mediaRecorder.resume(); });
                videoStop.addEventListener('click', () => { mediaRecorder.stop(); });

                // If audio data available then push
                // it to the chunk array
                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0)
                        _recordedChunks.push(e.data);
                }
                mediaRecorder.onpause = async () => {
                    videoPause.style.display = "none";
                    videoResume.style.display = "inline-block";
                    clearInterval(interval);
                };
                mediaRecorder.onresume = async () => {
                    videoResume.style.display = "none";
                    videoPause.style.display = "inline-block";
                    videoStop.style.display = "inline-block";
                    runInterval();
                };

                // Convert the audio data in to blob
                // after stopping the recording
                mediaRecorder.onstop = async function (ev) {
                    videoTrackWithoutAudio.forEach((track) => {
                        track.stop();
                    });
                    clearInterval(interval);
                    videoWithoutBtn.style.display = "inline-block";
                    recordVideoWithout.style.display = "none";
                    var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
                    let url = window.URL.createObjectURL(blob);
                    // take file input
                    let fileName = prompt("Enter file name", "my-video");

                    // console.log(blob, _recordedChunks, url);

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
                    formData.append("videowithout", blob);
                    formData.append("filename", fileName);
                    formData.append("date", date);
                    formData.append("time", time);


                    // appendin location into form data
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

                    fetch(`${baseURL}/videowithout`, {
                        method: 'POST',
                        body: formData
                    }).then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                            setAlert(true);
                            setAlertTime(2000);
                        });

                    videoWithoutAudio.srcObject = null;
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
        <div className="videoWithoutAudio-sec">
            {alert ? <Alert text="File Saved" /> : ""}
            <h3>Video Without Audio</h3>
            <div className="inner-record">
                <video autoPlay muted className="videoWithoutAudioCtr"></video>
            </div>
            <button className="video-rec-withoutAudio" onClick={handleClick}>Start</button>
            <div className="videoWithoutAudio-sec-btn">
                <span className="videoWithoutAudio-duration duration">00:00</span>
                <button id="videoWithoutAudiobtnPauseReco">Pause</button>
                <button id="videoWithoutAudiobtnResumeReco" style={{ display: "none" }}>Resume</button>
                <button id="videoWithoutAudiobtnStopReco">Stop</button>
            </div>
        </div>
    )
}

export default VideoWithout