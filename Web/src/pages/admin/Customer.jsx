import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { FaUsers, FaBox, FaUber, FaList, FaHome, FaInfoCircle, FaSignOutAlt, FaChartBar, FaFilter, FaEdit, FaSave, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { HeaderAdmin } from "../../components";
import { getAccounts, getOrders } from "../../services/apiService";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-white shadow position-fixed" style={{ width: "250px", height: "100vh", top: "0", left: "0" }}>
      <h4 className="text-primary text-center">Seller Page</h4>
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link text-dark">
            <FaUsers className="me-2" /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/productsad" className="nav-link text-dark">
            <FaBox className="me-2" /> Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/orderlist" className="nav-link text-dark">
            <FaList className="me-2" /> Order Lists
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/productstock" className="nav-link text-dark">
            <FaChartBar className="me-2" /> Product Stock
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/customer" className="nav-link text-white fw-bold bg-primary p-2 rounded">
            <FaUber className="me-2" /> Customer
          </Link>
        </li>
      </ul>
      <hr />
      <Link to="/" className="nav-link text-danger">
        <FaHome className="me-2" /> Back to Home
      </Link>
      <Link to="/login" className="nav-link text-danger">
        <FaSignOutAlt className="me-2" />Login
      </Link>
    </div>
  );
};

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [orderDetails, setOrderDetails] = useState({}); // Lưu thông tin đơn hàng của khách hàng

  const [selectedOrderStatus, setSelectedOrderStatus] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [expandedAccountId, setExpandedAccountId] = useState(null);
  const calculateFinalPrice = (price, discount) => price - (price * discount) / 100;

  // Lấy danh sách khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getAccounts();
        res.data.sort((a, b) => a.id_account - b.id_account);
        setCustomers(res.data || []);
        setFilteredCustomers(res.data || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Lọc khách hàng theo từ khóa, xử lý giá trị undefined
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const customerName = customer.full_name || ""; // Xử lý nếu name bị undefined
      const keyword = searchKeyword || ""; // Xử lý nếu searchKeyword bị undefined
      return customerName.toLowerCase().includes(keyword.toLowerCase());
    });
    setFilteredCustomers(filtered);
  }, [searchKeyword, customers]);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const dateFilter =
      (!start || orderDate >= start) && (!end || orderDate <= end);
    const orderStatusFilter =
      selectedOrderStatus.length === 0 || selectedOrderStatus.includes(order.order_status);
    const paymentStatusFilter =
      selectedPaymentStatus.length === 0 || selectedPaymentStatus.includes(order.payment_status);

    return dateFilter && orderStatusFilter && paymentStatusFilter;
  });

  const totalOrderDetails = (id_account) => {
    setExpandedAccountId(expandedAccountId === id_account ? null : id_account);
  };

  return (
    <div className="container-fluid mt-5 py-4" style={{ background: "#f4f7fa" }}>
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="p-4">
          <h2 className="fw-bold mb-4" style={{ color: "#1a3c61" }}>Customer Management</h2>
          <div className="d-flex align-items-center gap-3 p-3 bg-white rounded shadow-sm mb-4 flex-wrap">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          {/* <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">NAME</th>
                    <th className="p-3">ADDRESS</th>
                    <th className="p-3">DATE</th>
                    <th className="p-3">TOTAL</th>
                    <th className="p-3">ORDER STATUS</th>
                    <th className="p-3">PAYMENT STATUS</th>
                    <th className="p-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <React.Fragment key={order.id_order}>
                        <tr className="align-middle">
                          <td className="p-3">{order.id_order}</td>
                          <td className="p-3">{order.full_name}</td>
                          <td className="p-3">{`${order.province}`}</td>
                          <td className="p-3">{formatDate(order.created_at)}</td>
                          <td className="p-3">{order.total_price?.toLocaleString() || "0"} đ</td>
                          <td className="p-3">
                            {editingOrderId === order.id_order ? (
                              <select
                                className="form-select form-select-sm shadow-sm"
                                value={editingValues.order_status}
                                onChange={(e) => handleStatusChange("order_status", e.target.value)}
                              >
                                {orderStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`badge ${getBadgeClass(order.order_status)} p-2`}>
                                {order.order_status}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {editingOrderId === order.id_order ? (
                              <select
                                className="form-select form-select-sm shadow-sm"
                                value={editingValues.payment_status}
                                onChange={(e) => handleStatusChange("payment_status", e.target.value)}
                              >
                                {paymentStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`badge ${getBadgeClass(order.payment_status)} p-2`}>
                                {order.payment_status}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="d-flex gap-2">
                              {editingOrderId === order.id_order ? (
                                <>
                                  <button
                                    className="btn btn-success btn-sm shadow-sm"
                                    onClick={() => saveChanges(order.id_order)}
                                  >
                                    <FaSave /> Save
                                  </button>
                                  <button className="btn btn-secondary btn-sm shadow-sm" onClick={cancelEditing}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn btn-primary btn-sm shadow-sm"
                                  onClick={() => startEditing(order)}
                                >
                                  <FaEdit /> Edit
                                </button>
                              )}
                              <button
                                className="btn btn-info btn-sm shadow-sm text-white"
                                onClick={() => toggleOrderDetails(order.id_order)}
                              >
                                {expandedOrderId === order.id_order ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedOrderId === order.id_order && (
                          <tr>
                            <td colSpan="8" className="p-0">
                              <div className="bg-light p-4 mx-2 mb-3 rounded shadow-sm">
                                <h5 className="fw-bold mb-3" style={{ color: "#1a3c61" }}>Order Details</h5>
                                <div className="row mb-3">
                                  <div className="col-md-6">
                                    <p><strong>Customer:</strong> {order.full_name}</p>
                                    <p><strong>Phone:</strong> {order.phone_number}</p>
                                    <p><strong>Address:</strong> {`${order.ward}, ${order.district}, ${order.province}`}</p>
                                    <p><strong>Detailed Address:</strong> {`${order.detailed_address}`}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>

                                    <p><strong>Order Status:</strong> <span className={`badge ${getBadgeClass(order.order_status)} p-2`}>{order.order_status}</span></p>
                                    <p><strong>Payment Status:</strong> <span className={`badge ${getBadgeClass(order.payment_status)} p-2`}>{order.payment_status}</span></p>
                                  </div>
                                </div>
                                <div className="table-responsive">
                                  <table className="table table-bordered table-striped">
                                    <thead className="bg-primary text-white">
                                      <tr>
                                        <th>Image</th>
                                        <th>Book</th>
                                        <th>Author</th>
                                        <th>Price</th>
                                        <th>Discount</th>
                                        <th>Final Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>

                                      {order.order_details?.map((item, index) => {
                                        const finalPrice = calculateFinalPrice(item.price, item.discount);
                                        const itemTotal = finalPrice * item.quantity;
                                        return (
                                          <tr key={index}>
                                            <td className="text-center">
                                              <img
                                                src={`data:image/jpeg;base64,${item.image_data}`}
                                                alt={item.book_name}
                                                className="img-thumbnail"
                                                style={{ width: "50px", height: "70px", objectFit: "cover" }}
                                              />
                                            </td>
                                            <td>{item.book_name}</td>
                                            <td>{item.author}</td>
                                            <td>{item.price?.toLocaleString() || "0"} đ</td>
                                            <td>{item.discount}%</td>
                                            <td>{finalPrice?.toLocaleString() || "0"} đ</td>
                                            <td>{item.quantity}</td>
                                            <td>{parseInt(itemTotal)?.toLocaleString() || "0"} đ</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div> */}
          <table className="table table-hover">
            <thead className="bg-primary text-white">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Order Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id_order}>
                  <tr className="align-middle">
                    <td>{customer.id_account}</td>
                    <td>{customer.full_name}</td>
                    <td>{customer.phone_num}</td>
                    <td>{customer.email}</td>
                    <td>
                      <button className="btn btn-info" onClick={() => totalOrderDetails(customer.id_account)}>
                        {expandedAccountId === customer.id_account ? "Hide Orders" : "View Orders"}
                      </button>
                      {expandedAccountId === customer.id_account && (
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped">
                            <thead className="bg-primary text-white">
                              <tr>
                                <th>Image</th>
                                <th>Book</th>
                                <th>Author</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Final Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>

                              {customer.order_details?.map((item, index) => {
                                const finalPrice = calculateFinalPrice(item.price, item.discount);
                                const itemTotal = finalPrice * item.quantity;
                                return (
                                  <tr key={index}>
                                    <td className="text-center">
                                      <img
                                        src={`data:image/jpeg;base64,${item.image_data}`}
                                        alt={item.book_name}
                                        className="img-thumbnail"
                                        style={{ width: "50px", height: "70px", objectFit: "cover" }}
                                      />
                                    </td>
                                    <td>{item.book_name}</td>
                                    <td>{item.author}</td>
                                    <td>{item.price?.toLocaleString() || "0"} đ</td>
                                    <td>{item.discount}%</td>
                                    <td>{finalPrice?.toLocaleString() || "0"} đ</td>
                                    <td>{item.quantity}</td>
                                    <td>{parseInt(itemTotal)?.toLocaleString() || "0"} đ</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customer;