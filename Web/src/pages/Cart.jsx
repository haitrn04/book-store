import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;
  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Your Cart is Empty</h4>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    let cartMsg = localStorage.getItem("cart-msg") || "0"; 
    cartMsg = parseInt(cartMsg); 

    let exist = state.find((item) => item.id_book === product.id_book);
    
    if (exist) {
      if (exist.qty >= product.stock) {
        cartMsg += 1;
        localStorage.setItem("cart-msg", cartMsg.toString());
        if (cartMsg >= 1) {
          toast.error("Out of stock");
        }
        return;
      }
    }
    dispatch(addCart(product));
    localStorage.setItem("cart-msg", "0"); 
    toast.success("Added to cart");
  };
  

  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const ShowCart = () => {
    let originalSubtotal = 0;
    let discountedSubtotal = 0;
    let totalSavings = 0;
    let shipping = 0;
    let totalItems = 0;

    state.map((item) => {
      const originalItemTotal = parseInt(item.price * item.qty);
      const discountedItemTotal = parseInt(item.price * item.qty * (1 - item.discount / 100));

      originalSubtotal += originalItemTotal;
      discountedSubtotal += discountedItemTotal;
      totalSavings += (originalItemTotal - discountedItemTotal);
      return totalItems += item.qty;
    });

    // Calculate VAT

    const finalTotal = discountedSubtotal + shipping ;

    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Your Cart</h5>
                    <span className="badge bg-primary rounded-pill">{totalItems} items</span>
                  </div>
                  <div className="card-body">
                    {state.map((item) => {
                      const originalPrice = parseInt(item.price);
                      const discountedPrice = parseInt(item.price * (1 - item.discount / 100));
                      const savedAmount = originalPrice - discountedPrice;

                      return (
                        <div key={item.id_book}>
                          <div className="row d-flex align-items-center">
                            <div className="col-lg-3 col-md-12">
                              <div
                                className="bg-image rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={`data:image/jpeg;base64,${item.image_data}`}
                                  className="img-fluid"
                                  alt={item.book_name}
                                  width={75}
                                  height={125}
                                />
                              </div>
                            </div>

                            <div className="col-lg-5 col-md-6">
                              <p>
                                <strong>{item.book_name}</strong>
                              </p>
                              {item.discount > 0 && (
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-danger me-2">-{item.discount}%</span>
                                  <span className="text-success small">
                                    <i className="fas fa-tag me-1"></i>
                                    Save {savedAmount.toLocaleString("vi-VN")}<sup>₫</sup>
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div
                                className="d-flex mb-3 justify-content-center"
                              >
                                <button
                                  className="btn btn-outline-secondary px-3"
                                  onClick={() => {
                                    removeItem(item);
                                  }}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>

                                <div className="form-outline mx-3">
                                  <input
                                    type="number"
                                    id={`quantity-${item.id_book}`}
                                    name="quantity"
                                    className="form-control text-center"
                                    value={item.qty}
                                    readOnly
                                    style={{
                                      width: "60px",
                                      fontWeight: "bold",
                                      textAlign: "center"
                                    }}
                                  />
                                </div>

                                <button
                                  className="btn btn-outline-secondary px-3"
                                  onClick={() => {
                                    addItem(item);
                                  }}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>

                              <div className="text-center">
                                {item.discount > 0 ? (
                                  <>
                                    <p className="mb-1">
                                      <span className="text-muted text-decoration-line-through">
                                        {originalPrice.toLocaleString("vi-VN")}<sup>₫</sup>
                                      </span>
                                    </p>
                                    <p className="mb-0">
                                      <strong className="text-danger">
                                        {discountedPrice.toLocaleString("vi-VN")}<sup>₫</sup>
                                      </strong>
                                      <span className="text-muted ms-2">x {item.qty}</span>
                                    </p>
                                    <p className="mb-0 small text-danger">
                                      <strong>
                                        = {(discountedPrice * item.qty).toLocaleString("vi-VN")}<sup>₫</sup>
                                      </strong>
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="mb-0">
                                      <strong>
                                        {originalPrice.toLocaleString("vi-VN")}<sup>₫</sup>
                                      </strong>
                                      <span className="text-muted ms-2">x {item.qty}</span>
                                    </p>
                                    <p className="mb-0 small">
                                      <strong>
                                        = {(originalPrice * item.qty).toLocaleString("vi-VN")}<sup>₫</sup>
                                      </strong>
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <hr className="my-4" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Subtotal ({totalItems} items)
                        <span>{originalSubtotal.toLocaleString("vi-VN")}<sup>₫</sup></span>
                      </li>

                      {totalSavings > 0 && (
                        <li className="list-group-item d-flex justify-content-between align-items-center text-success px-0">
                          Discount
                          <span>-{totalSavings.toLocaleString("vi-VN")}<sup>₫</sup></span>
                        </li>
                      )}

                      <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                        Shipping
                        <span>{shipping.toLocaleString("vi-VN")}<sup>₫</sup></span>
                      </li>


                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">

                        <div>
                          <strong>Total</strong>
                        </div>
                        <span>
                          <strong className="text-danger h5">{finalTotal.toLocaleString("vi-VN")}<sup>₫</sup></strong>
                        </span>
                      </li>
                    </ul>

                    <Link
                      to="/checkout"
                      className="btn btn-danger btn-lg btn-block w-100 mb-2"
                    >
                      <i className="fas fa-lock me-2"></i>Proceed to Checkout
                    </Link>

                    <Link
                      to="/product"
                      className="btn btn-outline-secondary btn-block w-100"
                    >
                      <i className="fas fa-arrow-left me-2"></i>Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar user={storedUser} />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
