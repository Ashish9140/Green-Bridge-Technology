import { useContext,useState } from 'react';
import React from 'react'
import { CartContext } from '../CartContext';
import Alert from './Alert';

const AudioRecord = () => {
    const [alert, setAlert] = useState(false);
    const { auth, formatDate, formatTime, user, baseURL} = useContext(CartContext);

    let duration = 0;
    let interval, intervalLoc;

    const setAlertTime = (time) => {
        setTimeout(() => {
            setAlert(false);
        }, time);
    }


    const handleClick = async () => {

        await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        }).then(async (screenStream) => {

            var micConstraints = { audio: true };
            navigator.mediaDevices.getUserMedia(micConstraints).then(function (micStream) {

                //create a new stream in which to pack everything together
                var mediaStreamObj = new MediaStream();

                //create new Audio Context
                var context = new AudioContext();

                //create new MediaStream destination. This is were our final stream will be.
                var audioDestinationNode = context.createMediaStreamDestination();

                //check to see if we have a microphone stream and only then add it
                if (micStream && micStream.getAudioTracks().length > 0) {
                    //get the audio from the microphone stream
                    const micSource = context.createMediaStreamSource(micStream);

                    //set it's volume
                    const micGain = context.createGain();
                    micGain.gain.value = 1.0;

                    //add it to the destination
                    micSource.connect(micGain).connect(audioDestinationNode);
                }

                //check to see if we have a screen stream and only then add it
                if (screenStream && screenStream.getAudioTracks().length > 0) {
                    //get the audio from the screen stream
                    const systemSource = context.createMediaStreamSource(screenStream);

                    //set it's volume (from 0.1 to 1.0)
                    const systemGain = context.createGain();
                    systemGain.gain.value = 1.0;

                    //add it to the destination
                    systemSource.connect(systemGain).connect(audioDestinationNode);

                }

                //add the combined audio stream
                audioDestinationNode.stream.getAudioTracks().forEach(function (audioTrack) {
                    mediaStreamObj.addTrack(audioTrack);
                });

                // assets
                let audio = document.querySelector(".audioCtr");
                let recordAudio = document.querySelector(".audio-sec-btn");
                let audioBtn = document.querySelector(".audio-rec");
                let durationBtn = document.querySelector(".audio-duration");

                // buttons
                let audioPause = document.getElementById('audiobtnPauseReco');
                let audioResume = document.getElementById('audiobtnResumeReco');
                let audioStop = document.getElementById('audiobtnStopReco');

                audioResume.style.display = "none";
                audioPause.style.display = "inline-block";
                audioStop.style.display = "inline-block";

                // getting media tracks
                let screenTrackWithAudio = screenStream.getTracks();
                let audioTracks = micStream.getTracks();
                // Chunk array to store the audio data
                let _recordedChunks = [];
                audio.srcObject = mediaStreamObj;
                audio.defaultMuted = true;
                recordAudio.style.display = "flex";
                audioBtn.style.display = 'none';

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


                // setup media recorder 
                let mediaRecorder = new MediaRecorder(mediaStreamObj);

                // Start event
                mediaRecorder.start();
                audioPause.addEventListener('click', () => { mediaRecorder.pause(); });
                audioResume.addEventListener('click', () => { mediaRecorder.resume() });
                audioStop.addEventListener('click', () => { mediaRecorder.stop(); });

                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0)
                        _recordedChunks.push(e.data);
                }
                mediaRecorder.onpause = async () => {
                    audioPause.style.display = "none";
                    audioResume.style.display = "inline-block";
                    clearInterval(interval);
                };
                mediaRecorder.onresume = async () => {
                    audioResume.style.display = "none";
                    audioPause.style.display = "inline-block";
                    audioStop.style.display = "inline-block";
                    runInterval();
                };

                mediaRecorder.onstop = async function (ev) {
                    screenTrackWithAudio.forEach((track) => {
                        track.stop();
                    });
                    audioTracks.forEach((track) => {
                        track.stop();
                    });
                    clearInterval(interval);
                    recordAudio.style.display = "none";
                    audioBtn.style.display = 'inline-block';
                    let blob = new Blob(_recordedChunks, { type: 'audio/mp3' });
                    // let url = window.URL.createObjectURL(blob);
                    let fileName = prompt("Enter file name", "my-audio");

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
                    formData.append("audio", blob);
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
                    formData.append("searchname", user.name);
                    formData.append("searchtype", user.type);
                    formData.append("searchversion", user.version);
                    formData.append("devicebrand", user.device.brand);
                    formData.append("devicename", user.device.name);
                    formData.append("devicetype", user.device.type);
                    formData.append("osname", user.os.name);
                    formData.append("ostype", user.os.type);

                    fetch(`${baseURL}/audio`, {
                        method: 'POST',
                        body: formData
                    }).then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                            setAlert(true);
                            setAlertTime(200);
                        });

                    audio.srcObject = null;
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

        })
            .catch(function (err) {
                console.log(err.name, err.message);
            });
    }

    return (
        <div className="audio-sec">
            {alert ? <Alert text="File Saved" /> : ""}
            <h3>Record Audio</h3>
            <div>
                <audio autoPlay controls muted className="audioCtr"></audio>
            </div>
            <button className="audio-rec" onClick={handleClick}>Start</button>
            <div className="audio-sec-btn">
                <span className="audio-duration duration">00:00</span>
                <button id="audiobtnPauseReco">Pause</button>
                <button id="audiobtnResumeReco" style={{ display: "none" }}>Resume</button>
                <button id="audiobtnStopReco">Stop</button>
            </div>
        </div>
    )
}

export default AudioRecord