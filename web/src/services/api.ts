import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333' //Endereço URL Hospedagem precisa alterar*
});

export default api;