import axios from 'axios';

const postLogin = (email, password) => {
    return axios.post('http://localhost:3005/login', { email, password });
};

const postRegister = (full_name, email, password, mobile, gender, birthday) => {
    return axios.post('http://localhost:3005/accounts/register', { full_name, email, password, mobile, gender, birthday });
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
const postEditProduct = (book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description, image_name) => {
    return axios.post('http://localhost:3005/products/editproduct', { book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description, image_name });
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

const editInfor = (formData) => {
    return axios.post('http://localhost:3005/accounts/editinfor', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
const postAddress = (formData) => {
    return axios.post('http://localhost:3005/address/addaddress', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
const editAddress = (formData) => {
    return axios.post('http://localhost:3005/address/editaddress', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
const getAddress = (id_account) => {
    return axios.get(`http://localhost:3005/address/getaddress/?id_account=${id_account}`);
}
const deleteProductbyID = (id_book) => {
    return axios.delete(`http://localhost:3005/products/deleteproduct/?id_book=${id_book}`)
}

const deleteAddress =(address_id) => {
    return axios.delete(`http://localhost:3005/address/deleteaddress/?address_id=${address_id}`);
}
export { postLogin, getImage, postRegister, postAddProduct,postEditProduct, 
        getProducts, getProductbyID, getGenre, getInfor,deleteProductbyID,
        getProductbyGenre, postAddress, getAddress, editAddress, deleteAddress, editInfor }; 
