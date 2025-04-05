import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/action";
import  OrderConfirmationEmail  from "../pages/mail";
import {sendmail, getOrderByID} from "../services/apiService";
import ReactDOMServer from "react-dom/server";

const OrderSuccess = () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user")).data;
    const orderInfo = JSON.parse(sessionStorage.getItem("order")) || { data: { id_order: null, total_price: 0 } };
    const dispatch = useDispatch();
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify([])); 
        dispatch(clearCart()); 

    }, [dispatch]);

useEffect(() => {
    const fetchOrderDetails = async () => {
        try {
            const response = await getOrderByID(orderInfo.id_order);
            
            const processedOrderDetails = Array.isArray(response.data.order_details) 
                ? response.data.order_details.map(detail => ({
                    ...detail,
                }))
                : [];

            const mail = ReactDOMServer.renderToStaticMarkup(
                <OrderConfirmationEmail 
                    order={response.data.order} 
                    orderDetails={processedOrderDetails} 
                />
            );

            const email = storedUser.email.toString();
            await sendmail(email, "Đơn hàng của bạn đã được thanh toán thành công!", mail);
        } catch (error) {
            console.error("Error fetching order details or sending email:", error);
        }
    };

    if (orderInfo.id_order) {
        fetchOrderDetails();
    }
}, [orderInfo.id_order, storedUser.email]);
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
