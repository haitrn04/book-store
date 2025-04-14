import React, { useState, useEffect } from "react";
import { Footer, Navbar, Loading } from "../../components";
import {
  FaUsers,
  FaSearch,
  FaAddressCard,
  FaCartPlus,
  FaUser,
  FaCommentDots,
  FaStar,
  FaCamera,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getOrderByAccountID, updateOrderStatus, getBookReviewbyIdBookAndIdOrder } from "../../services/apiService";
import axios from "axios";

// === Component Sidebar (Thanh điều hướng) ===
const Sidebar = () => {
  return (
    <>
      <div
        className="d-flex flex-column p-3 bg-white shadow rounded d-md-block d-none"
        style={{
          width: "250px",
          height: "calc(100vh - 100px)",
          position: "sticky",
          top: "100px",
        }}
      >
        <ul className="nav flex-column mt-3">
          <li className="nav-item">
            <Link to="/managemyaccount" className="nav-link text-dark">
              <FaUsers className="me-2" /> Manage my account
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/myprofile" className="nav-link text-dark">
              <FaUser className="me-2" /> My Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/addressbook" className="nav-link text-dark">
              <FaAddressCard className="me-2" /> Address Book
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/myorder" className="nav-link text-white fw-bold bg-primary p-2 rounded">
              <FaCartPlus className="me-2" /> My order
            </Link>
          </li>
        </ul>
      </div>

      {/* Menu ngang cho mobile */}
      <div className="d-md-none fixed-bottom bg-white shadow p-2">
        <ul className="nav justify-content-around to">
          <li className="nav-item">
            <Link to="/managemyaccount" className="nav-link text-dark">
              <FaUsers />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/myprofile" className="nav-link text-dark">
              <FaUser />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/addressbook" className="nav-link text-dark">
              <FaAddressCard />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/myorder" className="nav-link text-white fw-bold bg-primary p-2 rounded">
              <FaCartPlus />
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

// === Component OrderDetailModal (Modal hiển thị chi tiết đơn hàng) ===
const OrderDetailModal = ({ order, onClose }) => {
  const orderInfo = order.order;
  const order_details = order.order_details;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order details #{orderInfo.id_order}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <h6 style={{ fontWeight: "bold", marginBottom: "15px" }}>Order information</h6>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ margin: "5px 0" }}>
                <strong>Order ID: </strong> {orderInfo.id_order}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Total Price: </strong> {orderInfo.total_price.toLocaleString()} VND
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Payment status: </strong> {orderInfo.payment_status}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Order status: </strong> {orderInfo.order_status}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Booking date:</strong>{" "}
                {new Date(orderInfo.created_at).toLocaleString("vi-VN")}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Delivery information:</strong> {orderInfo.full_name},{" "}
                {orderInfo.phone_number}, {orderInfo.detailed_address}, {orderInfo.ward},{" "}
                {orderInfo.district}, {orderInfo.province}
              </p>
            </div>

            {/* Danh sách sản phẩm trong đơn hàng */}
            <h6 style={{ fontWeight: "bold", marginBottom: "15px" }}>Product list</h6>
            {order_details.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Image</th>
                      <th style={{ width: "20%" }}>Product name</th>
                      <th style={{ width: "20%" }}>Price</th>
                      <th style={{ width: "10%" }}>Quantity</th>
                      <th style={{ width: "20%" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order_details.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={`data:image/jpeg;base64,${item.image_data}`}
                            alt={item.book_name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        </td>
                        <td>{item.book_name}</td>
                        <td>{item.price.toLocaleString()} VND</td>
                        <td>{item.quantity}</td>
                        <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>There are no products in this order.</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(
    order.order_details.length === 1 ? 0 : -1
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null); // State to store existing review

 
  useEffect(() => {
    const fetchReview = async () => {
      if (selectedProductIndex === -1) return; 

      const selectedProduct = order.order_details[selectedProductIndex];
      const id_book = selectedProduct.id_book;
      const id_order = order.order.id_order;

      try {
        const response = await getBookReviewbyIdBookAndIdOrder(id_book, id_order);
        if (response.data && response.data.length > 0) {
          setExistingReview(response.data[0]); 
        } else {
          setExistingReview(null); 
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        setExistingReview(null);
      }
    };

    fetchReview();
  }, [selectedProductIndex, order.order.id_order, order.order_details]);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedia([files[0]]); // Chỉ lấy ảnh đầu tiên
  };

  const handleSubmit = async () => {
    if (selectedProductIndex === -1) {
      alert('Please select a product to review.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProduct = order.order_details[selectedProductIndex];
      const formData = new FormData();
      formData.append('id_order', order.order.id_order);
      formData.append('id_book', selectedProduct.id_book);
      formData.append('rating', rating);
      formData.append('created_at', new Date().toISOString().split('T')[0]);
      if (comment) {
        formData.append('review_text', comment);
      }
      if (media.length > 0) {
        formData.append('image_data', media[0]);
      }

      await axios.post('http://localhost:3005/review/addReview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSubmit({
        id_order: order.order.id_order,
        id_book: selectedProduct.id_book,
        rating,
        comment,
        media,
      });
      alert('Review submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting the review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Review the order #{order.order.id_order}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {order.order_details.length > 1 && (
              <div className="mb-3">
                <label>Select product:</label>
                <select
                  className="form-control"
                  value={selectedProductIndex}
                  onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
                  disabled={isSubmitting}
                >
                  <option value={-1}>-- Select product --</option>
                  {order.order_details.map((item, index) => (
                    <option key={index} value={index}>
                      {item.book_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedProductIndex !== -1 && (
              <div className="mb-3">
                <img
                  src={`data:image/jpeg;base64,${order.order_details[selectedProductIndex].image_data}`}
                  alt={order.order_details[selectedProductIndex].book_name}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <p>{order.order_details[selectedProductIndex].book_name}</p>
              </div>
            )}
            {selectedProductIndex !== -1 && existingReview ? (
              // Display existing review if it exists
              <div>
                <h6>Current Review:</h6>
                <div>
                  <label>Rating:</label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        color={star <= existingReview.rating ? 'gold' : 'gray'}
                        style={{ marginRight: '5px' }}
                      />
                    ))}
                  </div>
                </div>
                {existingReview.review_text && (
                  <div className="mt-3">
                    <label>Review Content:</label>
                    <p>{existingReview.review_text}</p>
                  </div>
                )}
                {existingReview.image_data && (
                  <div className="mt-3">
                    <label>Image:</label>
                    <div>
                      <img
                        src={`data:image/jpeg;base64,${existingReview.image_data}`}
                        alt="Review Image"
                        style={{ width: '50px', height: '50px', marginRight: '5px' }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-muted">
                  Reviewed on: {new Date(existingReview.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              // Show review form if no review exists
              selectedProductIndex !== -1 && (
                <>
                  <div>
                    <label>Product Rating:</label>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          color={star <= rating ? 'gold' : 'gray'}
                          onClick={() => setRating(star)}
                          style={{ cursor: 'pointer', marginRight: '5px' }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label>Image:</label>
                    <div>
                      <FaCamera style={{ cursor: 'pointer', marginRight: '10px' }} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMediaUpload}
                        multiple={false}
                        disabled={isSubmitting}
                      />
                      {media.length > 0 && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(media[0])}
                            alt="Preview"
                            style={{ width: '50px', height: '50px', marginRight: '5px' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label>Write a Review:</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </>
              )
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Close
            </button>
            {!existingReview && selectedProductIndex !== -1 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !rating || selectedProductIndex === -1}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// === Component Mitem (Thanh menu lọc đơn hàng) ===
const Mitem = ({ activeTab, setActiveTab }) => {
  return (
    <div className="thanh-menu" style={{ display: "flex", width: "100%" }}>
      <div
        className={`menu1 tr1 ${activeTab === "tr1" ? "active" : ""}`}
        style={{ marginRight: "25px", cursor: "pointer" }}
        onClick={() => setActiveTab("tr1")}
      >
        <p
          style={{
            fontWeight: "bold",
            borderBottom: activeTab === "tr1" ? "2px solid black" : "none",
          }}
        >
          All
        </p>
      </div>
      <div
        className={`menu1 tr2 ${activeTab === "tr2" ? "active" : ""}`}
        style={{ marginRight: "25px", cursor: "pointer" }}
        onClick={() => setActiveTab("tr2")}
      >
        <p
          style={{
            fontWeight: "bold",
            borderBottom: activeTab === "tr2" ? "2px solid black" : "none",
          }}
        >
          To Ship
        </p>
      </div>
      <div
        className={`menu1 tr3 ${activeTab === "tr3" ? "active" : ""}`}
        style={{ marginRight: "25px", cursor: "pointer" }}
        onClick={() => setActiveTab("tr3")}
      >
        <p
          style={{
            fontWeight: "bold",
            borderBottom: activeTab === "tr3" ? "2px solid black" : "none",
          }}
        >
          To Receive
        </p>
      </div>
      <div
        className={`menu1 tr4 ${activeTab === "tr4" ? "active" : ""}`}
        style={{ marginRight: "25px", cursor: "pointer" }}
        onClick={() => setActiveTab("tr4")}
      >
        <p
          style={{
            fontWeight: "bold",
            borderBottom: activeTab === "tr4" ? "2px solid black" : "none",
          }}
        >
          To Cancel
        </p>
      </div>
    </div>
  );
};

// === Component OrderItem (Hiển thị từng đơn hàng) ===
const OrderItem = ({ order, onView, onReview, onCancel }) => {
  const orderInfo = order.order;
  const order_details = order.order_details;

  return (
    <div
      className="order-item"
      style={{
        backgroundColor: "#fff",
        padding: "15px",
        margin: "20px 0",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      {/* Tiêu đề đơn hàng và trạng thái */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <div>
          <p style={{ fontWeight: "bold", margin: 0 }}>Shop book</p>
          <p style={{ margin: 0, color: "#888" }}>Order ID: {orderInfo.id_order}</p>
        </div>
        <button
          style={{
            backgroundColor:
              orderInfo.order_status === "processing"
                ? "#99FF99"
                : orderInfo.order_status === "shipped"
                ? "#CCCC00"
                : orderInfo.order_status === "pending"
                ? "#99FF99"
                : orderInfo.order_status === "delivered"
                ? "#00FFFF"
                : orderInfo.order_status === "cancelled"
                ? "#FAEBD7"
                : "#f0f0f0",
            border: "none",
            padding: "5px 10px",
            borderRadius: "15px",
          }}
        >
          {orderInfo.order_status}
        </button>
      </div>

      {/* Danh sách sản phẩm trong đơn hàng */}
      <div
        className="order-products"
        style={{ marginTop: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}
      >
        {order_details.length > 0 ? (
          order_details.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
              }}
            >
              <img
                src={`data:image/jpeg;base64,${item.image_data}`}
                alt={item.book_name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "15px",
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.book_name}</p>
                <p style={{ margin: "5px 0" }}>
                  {item.price.toLocaleString()} VND x {item.quantity}
                </p>
              </div>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {(item.price * item.quantity).toLocaleString()} VND
              </p>
            </div>
          ))
        ) : (
          <p>There are no products in this order.</p>
        )}
      </div>

      {/* Thông tin đơn hàng */}
      <div style={{ marginTop: "10px" }}>
        <p style={{ margin: "5px 0", fontSize: "25px", color: "red" }}>
          <strong style={{ color: "black", fontWeight: "bold" }}>Total price:</strong>{" "}
          {orderInfo.total_price.toLocaleString()} VND
        </p>
      </div>

      {/* Các nút hành động */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
        {orderInfo.order_status === "delivered" && (
          <button
            className="btn btn-secondary"
            style={{ padding: "5px 10px", borderRadius: "5px" }}
            onClick={() => onReview(order)}
          >
            <FaCommentDots className="me-2" /> Comment
          </button>
        )}
        <button
          className="btn btn-primary"
          style={{ padding: "5px 10px", borderRadius: "5px" }}
          onClick={() => onView(order)}
        >
          View details
        </button>
        {orderInfo.order_status !== "shipped" &&
          orderInfo.order_status !== "delivered" &&
          orderInfo.order_status !== "cancelled" && (
            <button
              className="btn btn-danger"
              style={{ padding: "5px 10px", borderRadius: "5px" }}
              onClick={() => onCancel(orderInfo.id_order)}
            >
              Cancel order
            </button>
          )}
      </div>
    </div>
  );
};

// === Component MyOrder (Component chính) ===
const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewOrder, setReviewOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmCancel, setShowConfirmCancel] = useState(null);
  const [activeTab, setActiveTab] = useState("tr1");

  const storedUser = JSON.parse(sessionStorage.getItem("user"))?.data;
  const accountId = storedUser?.id_account;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getOrderByAccountID(accountId);
      let ordersArray = Array.isArray(response) ? response : response.data || [];
      setOrders(ordersArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [accountId]);

  const handleCancelOrder = (orderId) => {
    if (!orderId) {
      alert("Cannot cancel order: Invalid order ID.");
      return;
    }
    setShowConfirmCancel(orderId);
  };

  const confirmCancelOrder = async (orderId) => {
    if (!orderId) {
      alert("Cannot cancel order: Invalid order ID.");
      setShowConfirmCancel(null);
      return;
    }

    try {
      await updateOrderStatus(orderId, { order_status: "cancelled" });
      setOrders((prev) =>
        prev.map((order) =>
          order.order.id_order === orderId
            ? { ...order, order: { ...order.order, order_status: "cancelled" } }
            : order
        )
      );
    } catch (error) {
      alert(`Cannot cancel order: ${error.response?.data?.error || error.message}`);
      try {
        const response = await getOrderByAccountID(accountId);
        setOrders(Array.isArray(response) ? response : response.data || []);
      } catch (refreshError) {
        console.error("Lỗi khi làm mới danh sách đơn hàng:", refreshError);
      }
    } finally {
      setShowConfirmCancel(null);
    }
  };

  const handleReviewSubmit = (data) => {
    console.log("Đánh giá đã được gửi:", data);
    // Có thể cập nhật state để vô hiệu hóa nút Comment cho sản phẩm đã đánh giá
    setOrders((prev) =>
      prev.map((order) =>
        order.order.id_order === data.id_order
          ? {
              ...order,
              order_details: order.order_details.map((item) =>
                item.id_book === data.id_book ? { ...item, is_reviewed: true } : item
              ),
            }
          : order
      )
    );
  };

  const onReview = (order) => {
    setReviewOrder(order);
  };

  const onView = (order) => {
    setSelectedOrder(order);
  };

  const onClose = () => {
    setSelectedOrder(null);
    setReviewOrder(null);
  };

  const filteredOrders = Array.isArray(orders)
    ? orders
        .filter((order) => {
          const lowerQuery = searchQuery.toLowerCase();
          const firstDetail = order.order_details?.[0] || {};
          return (
            "Book Store".toLowerCase().includes(lowerQuery) ||
            (order.order?.id_order?.toString().toLowerCase() || "").includes(lowerQuery) ||
            (firstDetail.book_name || "").toLowerCase().includes(lowerQuery) ||
            (order.order?.total_price?.toString().toLowerCase() || "").includes(lowerQuery)
          );
        })
        .filter((order) => {
          if (activeTab === "tr1") return true;
          if (activeTab === "tr2") return order.order.order_status === "shipped";
          if (activeTab === "tr3") return order.order.order_status === "delivered";
          if (activeTab === "tr4") return order.order.order_status === "cancelled";
          return true;
        })
    : [];

  return (
    <>
      <style>{`
        .container {
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          margin-right: auto;
          margin-left: auto;
        }
        .order-item {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .order-item p {
          margin: 5px 0;
          font-size: 14px;
        }
        .order-item strong {
          font-weight: bold;
          margin-right: 5px;
        }
        .modal-content {
          border-radius: 8px;
        }
        .modal-body {
          padding: 20px;
        }
        .modal-body p {
          margin: 5px 0;
          font-size: 14px;
        }
        .modal-body strong {
          font-weight: bold;
          margin-right: 5px;
        }
        .table {
          width: 100%;
          table-layout: auto;
          border-collapse: collapse;
        }
        .table th, .table td {
          vertical-align: middle;
          font-size: 14px;
          padding: 10px;
          text-align: left;
          white-space: normal;
          word-wrap: break-word;
        }
        .table th {
          background-color: #f5f5fa;
          font-weight: bold;
        }
        .table td img {
          display: block;
          margin: 0 auto;
        }
        .modal-body .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .d-md-none.fixed-bottom {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 60px;
          z-index: 1000;
          border-top: 1px solid #ddd;
          background-color: #fff;
        }
        .d-md-none .to {
          gap: 60px;
        }
        .d-md-none .nav-link {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;
          font-size: 18px;
          color: #333;
        }
        .d-md-none .nav-link.bg-primary {
          background-color: #007bff;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .confirm-modal {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 350px;
          text-align: center;
        }
        .confirm-modal p {
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 500;
        }
        .modal-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .modal-buttons .btn {
          padding: 8px 20px;
          font-size: 14px;
        }
        @media (max-width: 768px) {
          .Sidebar {
            width: 100%;
            height: auto;
            position: relative;
            top: 0;
            margin-bottom: 20px;
          }
          .nav-link {
            padding: 10px 0;
            gap: 55px;
          }
          .col-md-3, .col-md-9 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .order-item {
            padding: 10px;
          }
          .order-item p {
            font-size: 12px;
          }
          .modal-body p {
            font-size: 12px;
          }
          .table th, .table td {
            font-size: 12px;
            padding: 8px;
          }
          .table td img {
            width: 40px;
            height: 40px;
          }
        }
        @media (max-width: 767px) {
          .container.py-4 {
            padding-bottom: 80px;
          }
          footer {
            margin-bottom: 70px !important;
          }
        }
        @media (max-width: 576px) {
          .thanh-menu {
            display: flex;
          }
          .menu1 {
            margin-right: 0;
            margin-bottom: 10px;
          }
          .menu1 p {
            margin: 0;
          }
          .search {
            height: 40px;
            padding: 5px;
          }
          .search input {
            font-size: 12px;
            padding-left: 35px;
          }
          .search .FaSearch {
            left: 10px;
          }
          .modal-dialog {
            margin: 0.5rem;
          }
          h2 {
            font-size: 1.5rem;
          }
          p {
            font-size: 0.9rem;
          }
          .btn {
            font-size: 0.8rem;
            padding: 5px 10px;
          }
        }
      `}</style>

      <Navbar user={storedUser} />
      <div className="container py-4">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <h2 style={{ marginTop: "30px" }}>My Order</h2>
            <br />
            <Mitem activeTab={activeTab} setActiveTab={setActiveTab} />
            <br />
            <div
              className="search"
              style={{
                marginTop: "20px",
                height: "50px",
                position: "relative",
                backgroundColor: "#f5f5fa",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <FaSearch
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "15px",
                  transform: "translateY(-50%)",
                  color: "gray",
                }}
              />
              <input
                type="text"
                placeholder="Search by store name, order code or product name"
                style={{
                  width: "100%",
                  height: "30px",
                  paddingLeft: "40px",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  color: "#333",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isLoading ? (
              <div style={{ marginLeft: "50%", padding: "60px 0" }}>
                <tr style={{ position: "relative" }}>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    <div
                      style={{
                        position: "absolute",
                        left: "100%",
                        top: "100%",
                        transform: "translate(-100%, -100%)",
                        padding: "40px 0",
                      }}
                    >
                      <Loading isLoading={isLoading} />
                    </div>
                  </td>
                </tr>
              </div>
            ) : reviewOrder ? (
              <ReviewModal
                order={reviewOrder}
                onClose={() => setReviewOrder(null)}
                onSubmit={handleReviewSubmit}
              />
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderItem
                  key={order.order?.id_order || Math.random()}
                  order={order}
                  onView={onView}
                  onReview={onReview}
                  onCancel={handleCancelOrder}
                />
              ))
            ) : (
              <p style={{ marginTop: "20px" }}>Order not found.</p>
            )}
          </div>
        </div>
      </div>

      {showConfirmCancel !== null && (
        <div className="overlay" onClick={() => setShowConfirmCancel(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to cancel this order?</p>
            <div className="modal-buttons">
              <button
                className="btn btn-danger"
                onClick={() => confirmCancelOrder(showConfirmCancel)}
              >
                Yes
              </button>
              <button
                className="btn btn-light"
                onClick={() => setShowConfirmCancel(null)}
                style={{ backgroundColor: "#f2f2f2" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={onClose} />}
      <Footer />
    </>
  );
};

export default MyOrder;