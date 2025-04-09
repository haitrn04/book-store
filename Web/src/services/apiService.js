import axios from 'axios';

const postLogin = (email, password) => {
    return axios.post('http://localhost:3005/login', { email, password });
};

const postPayment = (user_name, total_price, items) => {
    return axios.post('http://localhost:3005/payment', { user_name, total_price, items });
};

const postOrderStatus = (app_trans_id) => {
    return axios.post(`http://localhost:3005/order-status/${app_trans_id}`, { app_trans_id });
};

const postRegister = (full_name, email, password, mobile, gender, birthday) => {
    return axios.post('http://localhost:3005/accounts/register', { full_name, email, password, mobile, gender, birthday });
};
const changePass = (id_account, oldPass, newPass) => {
    return axios.post('http://localhost:3005/accounts/changepass', id_account, oldPass, newPass)
}
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
const getProductsIfExist = () => {
    return axios.get('http://localhost:3005/products/getProductsIfExist');
};

const getCountUser = () => {
    return axios.get('http://localhost:3005/accounts/getCountUser');
};
const getTotalOrders = () => {
    return axios.get('http://localhost:3005/order/getTotalOrders');
}
const getTotalSales = () => {
    return axios.get('http://localhost:3005/order/getTotalSales');
}

const getPendingOrders = () => {
    return axios.get('http://localhost:3005/order/getPendingOrders');
}

const getRecentTransactions = () =>{
    return axios.get('http://localhost:3005/order/getRecentTransactions');
}


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
            'Content-Type': 'multipart/form-data'
        }
    });
};
const getAccountbyName = (full_name) => {
    return axios.get(`http://localhost:3005/accounts/getusername/?full_name=${full_name}`);
}
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

const deleteAddress = (address_id) => {
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

const sendmail = (emailadd, subject, htmlcontent) => {
    return axios.post(`http://localhost:3005/sendmail`, { emailadd, subject, htmlcontent });
}
const getOrders = () => {
    return axios.get('http://localhost:3005/order/getOrders');
}
const getOrderByID = (id_order) => {
    return axios.get(`http://localhost:3005/order/getOrderByID/${id_order}`);
}
const getOrderByAccountID = (id_account) => {
    return axios.get(`http://localhost:3005/order/getOrderByAccountID/${id_account}`);
}
const updateOrderStatus = async (id_order, status) => {
    try {
        const response = await axios.post(`http://localhost:3005/order/${id_order}/status`, {
            order_status: status.order_status,
            payment_status: status.payment_status,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error.response?.data || error.message);
        throw error;
    }
};
export {
    postLogin, getImage, postRegister, postAddProduct, postEditProduct,
    getProducts, getProductbyID, getGenre, getInfor, deleteProductbyID,
    getProductbyGenre, postAddress, getAddress, editAddress, deleteAddress,
    editInfor, addOrderAndOrderDetail, addreview, deleteReview, getBookReviewbyID, sendmail,
    getBookReviewbyorderID, findProduct, changePass, getOrders, updateOrderStatus, getOrderByID, getOrderByAccountID,
    postPayment, postOrderStatus, getProductsIfExist, getCountUser, getTotalOrders, getTotalSales, getPendingOrders, getAccountbyName, getRecentTransactions
};
