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
const getGenre = () => {
    return axios.get('http://localhost:3005/genre')
}
const postAddProduct = ( book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description) => {
    return axios.post('http://localhost:3005/addproduct', {  book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description});
};
// thieu anh
const postEditProduct = ( book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description, image_name) => {
    return axios.post('http://localhost:3005/editproduct', {  book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description, image_name });
};

const getProducts = () => {
    return axios.get('http://localhost:3005/products');
};

const getProductbyID = (id_book) => {
    return axios.get(`http://localhost:3005/product/?id_book=${id_book}`);
}
export { postLogin, getImage, postRegister, postAddProduct,postEditProduct, getProducts, getProductbyID, getGenre }; 