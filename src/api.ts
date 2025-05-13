import axios from 'axios';

// send and receive HttpOnly cookie
const api = axios.create({
    baseURL: 'https://frontend-take-home-service.fetch.com',
    withCredentials: true,
});

export default api;