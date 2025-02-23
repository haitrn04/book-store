import axios from 'axios';

const postLogin = (email, password) => {
    return axios.post('http://localhost:3005/login', { email, password });
};

const postRegister = ( full_name, email, password ) => {
    return axios.post('http://localhost:3005/register', { full_name, email, password });
};

const getImage = (idImage) => {
    return axios.get(`http://localhost:3005/image/${idImage}`);
};

const postAddProduct = (book_id, book_name, genre, author, publisher, yopublication, price, discount, stock, image, description) => {
    return axios.post('http://localhost:3005/addproduct', { book_id, book_name, genre, author, publisher, yopublication, price, discount, stock, image, description });
};
// thieu anh
const postEditProduct = (book_id, book_name, genre, author, publisher, yopublication, price, discount, stock,  description) => {
    return axios.post('http://localhost:3005/editproduct', { book_id, book_name, genre, author, publisher, yopublication, price, discount, stock, description });
};

const getProducts = () => {
    return axios.get('http://localhost:3005/products');
};

const getProductbyID = (book_id) => {
    return axios.get(`http://localhost:3005/product/?book_id=${book_id}`);
}
export { postLogin, getImage, postRegister, postAddProduct,postEditProduct, getProducts, getProductbyID }; 