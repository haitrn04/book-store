import axios from 'axios';

const postLogin = (email, password) => {
    return axios.post('http://localhost:3005/login', { email, password });
};

const getImage = (idImage) => {
    return axios.get(`http://localhost:3005/image/${idImage}`);
};

export { postLogin, getImage };  