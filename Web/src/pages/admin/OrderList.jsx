import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaUber,
  FaList,
  FaChartBar,
  FaSignOutAlt,
  FaFilter,
  FaHome,
  FaEdit,
  FaSave,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { HeaderAdmin, Loading } from "../../components";
import { getOrders, updateOrderStatus } from "../../services/apiService";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-white shadow position-fixed"
      style={{ width: "250px", height: "100vh", top: "0", left: "0" }}
    >
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
          <Link
            to=""
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
            <FaList className="me-2" /> Order Lists
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/productstock" className="nav-link text-dark">
            <FaChartBar className="me-2" /> Product Stock
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/customer" className="nav-link text-dark">
            <FaUber className="me-2" /> Customer
          </Link>
        </li>
      </ul>
      <hr />
      <Link to="/" className="nav-link text-danger">
        <FaHome className="me-2" /> Back to Home
      </Link>
      <Link to="/login" className="nav-link text-danger">
        <FaSignOutAlt className="me-2" />
        Logout
      </Link>
    </div>
  );
};

const OrderList = () => {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOrderFilterBox, setShowOrderFilterBox] = useState(false);
  const [showPaymentFilterBox, setShowPaymentFilterBox] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [editingValues, setEditingValues] = useState({
    order_status: "",
    payment_status: "",
  });
  const [isLoading, setIsLoading] = useState(true); // Sửa: Khởi tạo true để loading ngay

  const orderStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const paymentStatuses = ["pending", "paid", "failed", "refunded"];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleOrderStatus = (status) => {
    setSelectedOrderStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const togglePaymentStatus = (status) => {
    setSelectedPaymentStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true); // Bật loading khi bắt đầu fetch
        const res = await getOrders();
        setOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false); // Tắt loading sau khi fetch xong
      }
    };
    fetchOrders();
  }, []);

  const startEditing = (order) => {
    setEditingOrderId(order.id_order);
    setEditingValues({
      order_status: order.order_status,
      payment_status: order.payment_status,
    });
  };

  const handleStatusChange = (field, value) => {
    setEditingValues({ ...editingValues, [field]: value });
  };

  const saveChanges = async (orderId) => {
    try {
      setIsLoading(true); // Bật loading khi lưu
      await updateOrderStatus(orderId, editingValues);
      setOrders((prev) =>
        prev.map((order) =>
          order.id_order === orderId ? { ...order, ...editingValues } : order
        )
      );
      setEditingOrderId(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsLoading(false); // Tắt loading sau khi lưu
    }
  };

  const cancelEditing = () => setEditingOrderId(null);

  const calculateFinalPrice = (price, discount) =>
    price - (price * discount) / 100;

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const dateFilter =
      (!start || orderDate >= start) && (!end || orderDate <= end);
    const orderStatusFilter =
      selectedOrderStatus.length === 0 ||
      selectedOrderStatus.includes(order.order_status);
    const paymentStatusFilter =
      selectedPaymentStatus.length === 0 ||
      selectedPaymentStatus.includes(order.payment_status);

    return dateFilter && orderStatusFilter && paymentStatusFilter;
  });

  console.log(filteredOrders);

  const getBadgeClass = (status) => {
    const classes = {
      pending: "bg-warning text-dark",
      processing: "bg-primary text-white",
      shipped: "bg-info text-white",
      delivered: "bg-success text-white",
      cancelled: "bg-danger text-white",
      paid: "bg-success text-white",
      failed: "bg-danger text-white",
      refunded: "bg-secondary text-white",
    };
    return classes[status] || "bg-secondary text-white";
  };

  return (
    <div
      className="container-fluid mt-5 py-4"
      style={{ background: "#f4f7fa" }}
    >
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="p-4">
          {" "}
          {/* Thêm position: relative */}
          <h2 className="fw-bold mb-4" style={{ color: "#1a3c61" }}>
            Order Lists
          </h2>
          <div className="d-flex align-items-center gap-3 p-3 bg-white rounded shadow-sm mb-4 flex-wrap">
            <FaFilter size={20} className="text-primary" />
            <span className="fw-medium">Filter By</span>
            <div className="d-flex gap-2 align-items-center">
              <input
                type="date"
                className="form-control w-auto shadow-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <span>to</span>
              <input
                type="date"
                className="form-control w-auto shadow-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </div>
            <button
              className="btn btn-primary shadow-sm"
              onClick={() => setShowOrderFilterBox(!showOrderFilterBox)}
            >
              Order Status
            </button>
            <button
              className="btn btn-primary shadow-sm"
              onClick={() => setShowPaymentFilterBox(!showPaymentFilterBox)}
            >
              Payment Status
            </button>
            <button
              className="btn btn-outline-danger shadow-sm"
              onClick={() => {
                setSelectedOrderStatus([]);
                setSelectedPaymentStatus([]);
                setStartDate("");
                setEndDate("");
              }}
            >
              Reset
            </button>
            {showOrderFilterBox && (
              <div
                className="bg-white shadow p-3 rounded mt-2 position-absolute"
                style={{ zIndex: 1000 }}
              >
                <h6 className="fw-bold mb-3">Select Order Status</h6>
                <div className="d-flex flex-wrap gap-2">
                  {orderStatuses.map((status) => (
                    <button
                      key={status}
                      className={`btn btn-sm ${
                        selectedOrderStatus.includes(status)
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => toggleOrderStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {showPaymentFilterBox && (
              <div
                className="bg-white shadow p-3 rounded mt-2 position-absolute"
                style={{ zIndex: 1000, left: "450px" }}
              >
                <h6 className="fw-bold mb-3">Select Payment Status</h6>
                <div className="d-flex flex-wrap gap-2">
                  {paymentStatuses.map((status) => (
                    <button
                      key={status}
                      className={`btn btn-sm ${
                        selectedPaymentStatus.includes(status)
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => togglePaymentStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="card shadow-sm border-0">
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
                          <td className="p-3">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="p-3">
                            {order.total_price?.toLocaleString() || "0"} đ
                          </td>
                          <td className="p-3">
                            {editingOrderId === order.id_order ? (
                              <select
                                className="form-select form-select-sm shadow-sm"
                                value={editingValues.order_status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    "order_status",
                                    e.target.value
                                  )
                                }
                                disabled={["cancelled", "delivered"].includes(
                                  order.order_status
                                )}
                              >
                                {orderStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className={`badge ${getBadgeClass(
                                  order.order_status
                                )} p-2`}
                              >
                                {order.order_status}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {editingOrderId === order.id_order ? (
                              <select
                                className="form-select form-select-sm shadow-sm"
                                value={editingValues.payment_status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    "payment_status",
                                    e.target.value
                                  )
                                }
                                disabled={[
                                  "failed",
                                  "refunded",
                                  "paid",
                                ].includes(order.payment_status)}
                              >
                                {paymentStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className={`badge ${getBadgeClass(
                                  order.payment_status
                                )} p-2`}
                              >
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
                                  <button
                                    className="btn btn-secondary btn-sm shadow-sm"
                                    onClick={cancelEditing}
                                  >
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
                                onClick={() =>
                                  toggleOrderDetails(order.id_order)
                                }
                              >
                                {expandedOrderId === order.id_order ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedOrderId === order.id_order && (
                          <tr>
                            <td colSpan="8" className="p-0">
                              <div className="bg-light p-4 mx-2 mb-3 rounded shadow-sm">
                                <h5
                                  className="fw-bold mb-3"
                                  style={{ color: "#1a3c61" }}
                                >
                                  Order Details
                                </h5>
                                <div className="row mb-3">
                                  <div className="col-md-6">
                                    <p>
                                      <strong>Customer:</strong>{" "}
                                      {order.full_name}
                                    </p>
                                    <p>
                                      <strong>Phone:</strong>{" "}
                                      {order.phone_number}
                                    </p>
                                    <p>
                                      <strong>Address:</strong>{" "}
                                      {`${order.ward}, ${order.district}, ${order.province}`}
                                    </p>
                                    <p>
                                      <strong>Detailed Address:</strong>{" "}
                                      {`${order.detailed_address}`}
                                    </p>
                                  </div>
                                  <div className="col-md-6">
                                    <p>
                                      <strong>Order Date:</strong>{" "}
                                      {formatDate(order.created_at)}
                                    </p>
                                    <p>
                                      <strong>Order Status:</strong>{" "}
                                      <span
                                        className={`badge ${getBadgeClass(
                                          order.order_status
                                        )} p-2`}
                                      >
                                        {order.order_status}
                                      </span>
                                    </p>
                                    <p>
                                      <strong>Payment Status:</strong>{" "}
                                      <span
                                        className={`badge ${getBadgeClass(
                                          order.payment_status
                                        )} p-2`}
                                      >
                                        {order.payment_status}
                                      </span>
                                    </p>
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
                                      {order.order_details?.map(
                                        (item, index) => {
                                          const finalPrice =
                                            calculateFinalPrice(
                                              item.price,
                                              item.discount
                                            );
                                          const itemTotal =
                                            finalPrice * item.quantity;
                                          return (
                                            <tr key={index}>
                                              <td className="text-center">
                                                <img
                                                  src={`data:image/jpeg;base64,${item.image_data}`}
                                                  alt={item.book_name}
                                                  className="img-thumbnail"
                                                  style={{
                                                    width: "50px",
                                                    height: "70px",
                                                    objectFit: "cover",
                                                  }}
                                                />
                                              </td>
                                              <td>{item.book_name}</td>
                                              <td>{item.author}</td>
                                              <td>
                                                {item.price?.toLocaleString() ||
                                                  "0"}{" "}
                                                đ
                                              </td>
                                              <td>{item.discount}%</td>
                                              <td>
                                                {finalPrice?.toLocaleString() ||
                                                  "0"}{" "}
                                                đ
                                              </td>
                                              <td>{item.quantity}</td>
                                              <td>
                                                {parseInt(
                                                  itemTotal
                                                )?.toLocaleString() || "0"}{" "}
                                                đ
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
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
                    <tr style={{ position: "relative" }}>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        <Loading isLoading={isLoading} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
