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
const postEditProduct = (formData) => {
    return axios.post('http://localhost:3005/products/editproduct', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
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

const findProduct = (book_name) => {
    return axios.get(`http://localhost:3005/products/getproductbyname/?book_name=${book_name}`);
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
const addOrderAndOrderDetail = (formData) => {
    return axios.post('http://localhost:3005/order/addOrderAndOrderDetail', formData, {
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

const addreview = (id_order, rating, review_text, created_at, id_book) => {
    return axios.post('http://localhost:3005/review/addreview', { id_order, rating, review_text, created_at, id_book });
}
const deleteReview = (id) => {
    return axios.delete(`http://localhost:3005/review/deleteReview/?id=${id}`);
}
const getBookReviewbyID = (id_book) => {
    return axios.get(`http://localhost:3005/review/getBookReviewbyID/?id_book=${id_book}`);
}
const getBookReviewbyorderID = (id_order) => {
    return axios.get(`http://localhost:3005/review/getBookReviewbyorderID/?id_order=${id_order}`);
}

export { postLogin, getImage, postRegister, postAddProduct,postEditProduct, 
        getProducts, getProductbyID, getGenre, getInfor,deleteProductbyID,
        getProductbyGenre, postAddress, getAddress, editAddress, deleteAddress,
        editInfor, addOrderAndOrderDetail, addreview, deleteReview, getBookReviewbyID, 
        getBookReviewbyorderID, findProduct }; 
