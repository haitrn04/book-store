import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAddress, addOrderAndOrderDetail } from "../services/apiService";
const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const storedUser = JSON.parse(sessionStorage.getItem("user"))?.data;
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAddress = async () => {
      const response = await getAddress(storedUser.id_account);
      setAddress(response.data);
      setSelectedAddress(response.data[0]);
    };
    fetchAddress();
  }, [storedUser.id_account]);
  console.log(address)
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
    let shipping = 0;
    let totalItems = 0;

    state.forEach((item) => {
      subtotal += parseInt(item.price * item.qty * (1 - item.discount / 100));
      totalItems += item.qty;
    });

    const handleSubmit = (event) => {
      event.preventDefault();
      if (selectedPayment === 'cod') {
        const order = {
          id_account: storedUser.id_account,
          address_id: selectedAddress.address_id,
          payment_status: 'pending',
          order_status: 'pending',
          order_details: state.map((item) => ({
            id_book: item.id_book,
            qty: item.qty,
            price: item.price,
            discount: item.discount
          }))
        };
        addOrderAndOrderDetail(order).then((response) => {
          if (response.status === 200) {
            sessionStorage.setItem("order", JSON.stringify(response.data));
            navigate("/OrderSuccess", { state: { order: order } });
          } else {
            navigate("/OrderFail");
          }
        });
      } else if (selectedPayment === 'momo') {
        alert('Chức năng thanh toán qua MoMo đang được phát triển');
      }
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
                    Products ({totalItems}) <span>{Math.round(subtotal).toLocaleString("vi-VN")} VNĐ</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping <span>{shipping.toLocaleString("vi-VN")} VNĐ</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <strong>Total amount</strong>
                    <strong>{Math.round(subtotal + shipping).toLocaleString("vi-VN")} VNĐ</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-7 col-lg-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h4 className="mb-0">Select address</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {address.length > 0 ? (
                    <>
                      {address.map((item) => (
                        <div className="form-check mb-3 d-flex align-items-center" key={item.address_id}>
                          <input
                            className="form-check-input me-2"
                            type="radio"
                            name="address"
                            id={item.address_id}
                            value={item.address_id}
                            checked={selectedAddress === item}
                            onChange={() => setSelectedAddress(item)}
                          />
                          <label className="form-check-label w-100" htmlFor={item.address_id}>
                            <div className="card border-secondary">
                              <div className="card-body">
                                <h6 className="card-title mb-2"><strong>Họ tên:</strong> {item.full_name}</h6>
                                <p className="card-text mb-2"><strong>Số điện thoại:</strong> {item.phone_number}</p>
                                <p className="card-text mb-2"><strong>Địa chỉ:</strong> {item.ward} - {item.district} - {item.province} </p>
                                <p className="card-text"><strong>Chi tiết:</strong> {item.detailed_address}</p>
                              </div>
                            </div>
                          </label>
                        </div>

                      ))}
                      <div className="payment-options">
                        <h5 className="mb-3">Chọn phương thức thanh toán</h5>
                        <div className="list-group">
                          <label className={`list-group-item list-group-item-action ${selectedPayment === 'cod' ? 'active' : ''}`} style={{ cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="payment"
                              value="cod"
                              className="d-none"
                              checked={selectedPayment === 'cod'}
                              onChange={() => setSelectedPayment('cod')}
                            />
                            Thanh toán bằng tiền mặt khi nhận hàng
                          </label>

                          <label className={`list-group-item list-group-item-action ${selectedPayment === 'momo' ? 'active' : ''}`} style={{ cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="payment"
                              value="momo"
                              className="d-none"
                              checked={selectedPayment === 'momo'}
                              onChange={() => setSelectedPayment('momo')}
                            />
                            Thanh toán qua MoMo
                          </label>
                        </div>
                      </div>
                      <hr className="my-4" />
                      <button className="w-100 btn btn-primary" type="submit">
                        Continue to checkout
                      </button>
                    </>
                  ) : (
                    <div className="no-address-container">
                      <p>You don't have any saved addresses. Please add an address.</p>
                      <button className="w-100 btn btn-primary" onClick={() => navigate("/AddressBook")}>
                        Go to Add Address
                      </button>
                    </div>
                  )}
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