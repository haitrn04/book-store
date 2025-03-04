import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const storedUser = JSON.parse(sessionStorage.getItem("user"))?.data;
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: storedUser?.full_name || "",
    email: storedUser?.email || "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const EmptyCart = () => (
    <div className="container text-center py-5">
      <h4 className="display-5">No item in Cart</h4>
      <Link to="/" className="btn btn-outline-dark mx-4">
        <i className="fa fa-arrow-left"></i> Continue Shopping
      </Link>
    </div>
  );

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    state.forEach((item) => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    const handleSubmit = (event) => {
      event.preventDefault();
      if (event.currentTarget.checkValidity() === false) {
        event.stopPropagation();
      }
      setValidated(true);
    };

    return (
      <div className="container py-5">
        <div className="row my-4">
          <div className="col-md-5 col-lg-4 order-md-last">
            <div className="card mb-4">
              <div className="card-header py-3 bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Products ({totalItems}) <span>{Math.round(subtotal)} VNĐ</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping <span>{shipping} VNĐ</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <strong>Total amount</strong>
                    <strong>{Math.round(subtotal + shipping)} VNĐ</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-7 col-lg-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h4 className="mb-0">Billing address</h4>
              </div>
              <div className="card-body">
                <form className={`needs-validation ${validated ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="fullName" className="form-label">Full name</label>
                      <input type="text" className="form-control" id="fullName" required value={formData.fullName} onChange={handleChange} />
                      <div className="invalid-feedback">Valid Full name is required.</div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" className="form-control" id="email" required value={formData.email} onChange={handleChange} />
                      <div className="invalid-feedback">Please enter a valid email address.</div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <button className="w-100 btn btn-primary" type="submit">Continue to checkout</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar user={storedUser} />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;