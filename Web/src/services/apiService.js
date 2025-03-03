import axios from 'axios';

const postLogin = (email, password) => {
    return axios.post('http://localhost:3005/login', { email, password });
};

const postRegister = ( full_name, email, password ) => {
    return axios.post('http://localhost:3005/accounts/register', { full_name, email, password });
};

const getImage = (idImage) => {
    return axios.get(`http://localhost:3005/image/${idImage}`);
};
const getGenre = () => {
    return axios.get('http://localhost:3005/accounts/genre')
}
const postAddProduct = (formData) => {
    return axios.post('http://localhost:3005/products/addproduct', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
// co anh
const postEditProduct = ( book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description, image_name) => {
    return axios.post('http://localhost:3005/products/editproduct', {  book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description, image_name });
};

const getProductbyGenre = (id_genre) => {
    return axios.get(`http://localhost:3005/products/getproductbygenre?id_genre=${id_genre}`);
};


const getProducts = () => {
    return axios.get('http://localhost:3005/products/getproducts');
};

const getProductbyID = (id_book) => {
    return axios.get(`http://localhost:3005/products/getproductbyid/?id_book=${id_book}`);
}

const getInfor = (id_account) => {
    return axios.get(`http://localhost:3005/accounts/infor/?id_account=${id_account}`);
}

const deleteProductbyID = (id_book) => {
    return axios.delete(`http://localhost:3005/products/deleteproduct/?id_book=${id_book}`)
}

export { postLogin, getImage, postRegister, postAddProduct,postEditProduct, getProducts, getProductbyID, getGenre, getInfor,deleteProductbyID, getProductbyGenre }; 