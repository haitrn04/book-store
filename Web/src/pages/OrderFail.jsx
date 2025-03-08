import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components";

const OrderFail = () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"))?.data;

    return (
        <>
            <Navbar user={storedUser} />
            <div className="container my-5 py-5 text-center">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card shadow-lg p-4">
                            <h2 className="text-danger mb-4">❌ Order Failed!</h2>
                            <p>Sorry, <strong>{storedUser?.full_name || "Customer"}</strong>. Your order could not be processed.</p>
                            <p>Please try again or contact support for assistance.</p>
                            <Link to="/checkout" className="btn btn-warning mt-3">
                                Try Again
                            </Link>
                            <Link to="/" className="btn btn-secondary mt-3 ms-2">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderFail;