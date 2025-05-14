import axios from 'axios';

// send and receive HttpOnly cookie
const api = axios.create({
    baseURL: '',
    withCredentials: true,
});

export default api;