import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/action";
import OrderConfirmationEmail from "../pages/mail";
import {sendmail} from "../services/apiService";

const OrderSuccess = () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"))?.data;
    const orderInfo = JSON.parse(sessionStorage.getItem("order")) || {id_order: null, total_price: 0};
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify([])); 
        dispatch(clearCart()); 
    }, [dispatch]);
    let mail =OrderConfirmationEmail(orderInfo.id_order);
    sendmail(storedUser.email,"Đơn hàng của bạn đã được thanh toán thành công!",mail);
    return (
        <>
            <Navbar user={storedUser} />
            <div className="container my-5 py-5 text-center">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card shadow-lg p-4">
                            <h2 className="text-success mb-4">🎉 Order Placed Successfully!</h2>
                            {orderInfo ? (
                                <>
                                    <p>Thank you, <strong>{storedUser?.full_name || "Customer"}</strong>, for your purchase!</p>
                                    <p><strong>Order ID:</strong> {orderInfo.id_order}</p>
                                    <p><strong>Total Price:</strong> {orderInfo.total_price} VNĐ</p>
                                    <p>You will receive an email confirmation soon.</p>
                                </>
                            ) : (
                                <p>No order information found.</p>
                            )}
                            <Link to="/" className="btn btn-primary mt-3">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderSuccess;
