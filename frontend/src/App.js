import './App.css';
import './Auth.css';
import './Profile.css';
import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from "react-router-dom";

import Register from './components/Register'
import Login from './components/Login'

// Cart Context
import { CartContext } from "./CartContext";
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import MySnaps from './pages/MySnaps';
import { refreshUser } from './http';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import UserProfile from './pages/UserProfile';
import Photo from './components/Data/Photo';
import Audio from './components/Data/Audio';
import Video from './components/Data/Video';
import Screen from './components/Data/Screen';
import Screenshot from './components/Data/Screenshot';
import Line from './components/Data/Line';
import Area from './components/Data/Area';


const App = () => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [adminuser, setAdminuser] = useState(null);

  let baseURL = "https://stchrom.tgb.software";
  let alt = null;

  let user1 = {
    name: '',
    type: '',
    version: '',
    ip: '',
    iptype: '',
    device: {
      brand: '',
      name: '',
      type: ''
    },
    os: {
      name: '',
      type: ''
    }
  };

  useEffect(() => {
    fetch(`https://api.ipregistry.co/?key=6eyjz6ms4w8s1ef7`).then((response) => response.json())
      .then((data) => {
        user1.ip = data.ip;
        user1.iptype = data.type;
        user1.name = data.user_agent.name;
        user1.type = data.user_agent.type;
        user1.version = data.user_agent.version;
        user1.device = data.user_agent.device;
        user1.os.name = data.user_agent.os.name;
        user1.os.type = data.user_agent.os.type;
        setUser(user1);
      })
  }, [])


  function formatDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '/' + month + '/' + year;
  }

  function formatTime() {
    let d = new Date();
    function pad(n) { return n < 10 ? '0' + n : n }
    return [pad(d.getHours()), ':',
    pad(d.getMinutes()), ':',
    pad(d.getSeconds())].join("");
  }


  // handle refresh
  useEffect(() => {
    (async () => {
      try {
        const token = JSON.parse(localStorage.getItem("smtoken"));
        // console.log(token);
        if (token !== null) {
          const { data } = await refreshUser({ token });
          localStorage.setItem("smtoken", JSON.stringify(data.token));
          // console.log(data);
          setAuth(data);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);


  return (
    <CartContext.Provider value={{ user, baseURL, formatDate, formatTime, alt, auth, setAuth, users, setUsers, adminuser, setAdminuser }}>

      <Router>
        <div>
          {auth && <Navbar />}
          <Routes>
            <Route path="/login" element={
              auth ? <Navigate replace to="/" /> : <Login />
            } />
            <Route path="/register" element={
              auth ? <Navigate replace to="/" /> : <Register />
            } />
            <Route path="/" element={
              !auth ? <Navigate replace to="/login" /> : <Home />
            } />
            <Route path="/mysnaps" element={
              !auth ? <Navigate replace to="/login" /> : <MySnaps />
            } />
            <Route path="/profile" element={
              !auth ? <Navigate replace to="/login" /> : <Profile />
            } />
            <Route path="/adminusers" element={
              (!auth || !auth.isAdmin) ? <Navigate replace to="/" /> : <AdminUsers />
            } />
            <Route path="/adminusers/profile" element={
              (!auth || !auth.isAdmin) ? <Navigate replace to="/" /> : <UserProfile />
            } />

            <Route path="/mysnaps/photo" element={!auth ? <Navigate replace to="/login" /> : <Photo />} />
            <Route path="/mysnaps/audio" element={!auth ? <Navigate replace to="/login" /> : <Audio />} />
            <Route path="/mysnaps/video" element={!auth ? <Navigate replace to="/login" /> : <Video />} />
            <Route path="/mysnaps/screen" element={!auth ? <Navigate replace to="/login" /> : <Screen />} />
            <Route path="/mysnaps/screenshot" element={!auth ? <Navigate replace to="/login" /> : <Screenshot />} />
            <Route path="/mysnaps/line" element={!auth ? <Navigate replace to="/login" /> : <Line />} />
            <Route path="/mysnaps/area" element={!auth ? <Navigate replace to="/login" /> : <Area />} />

          </Routes>
        </div>
      </Router>


    </CartContext.Provider>
  )

}

export default App;
