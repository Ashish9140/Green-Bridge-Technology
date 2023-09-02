import axios from 'axios';

const api = axios.create({
    baseURL: 'https://stchrom.tgb.software',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

// List of all the end point 
export const signUpUser = (data) => api.post('/signup', data);
export const loginUser = (data) => api.post('/login', data);
export const refreshUser = (data) => api.post('/refresh', data);
export const update = (data) => api.post('/update', data);
export const updateAvatar = (data) => api.post('/updateavatar', data);
export const getUsers = (data) => api.post('/getalias', data);
export const getProfile = (data) => api.post('/profile', data);
export const aliasData = (data) => api.post('/aliasdata2', data);

export default api;