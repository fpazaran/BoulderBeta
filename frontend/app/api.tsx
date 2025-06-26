import axios from 'axios'

const api = axios.create({
    baseURL: 'http://10.8.1.183:8000',
});

export default api;