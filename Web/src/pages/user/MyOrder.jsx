import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../../components";
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
import { getOrderByAccountID, updateOrderStatus } from "../../services/apiService";

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
}
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
            {/* Thông tin đơn hàng */}
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
                        <td>{item.price.toLocaleString()} $</td>
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

// === Component ReviewModal (Modal đánh giá sản phẩm) ===
const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [media, setMedia] = useState([]);
  const [anonymous, setAnonymous] = useState(false);
  const [sellerRating, setSellerRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedia([...media, ...files]);
  };

  const handleSubmit = () => {
    onSubmit({ rating, comment, media, anonymous, sellerRating, deliveryRating });
    onClose();
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{order.productName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div>
              <img
                src={order.imageUrl}
                alt="Product"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div>
              <label>Đánh giá sản phẩm:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  color={star <= rating ? "gold" : "gray"}
                  onClick={() => setRating(star)}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              ))}
            </div>
            <div className="mt-3">
              <label>Hình ảnh:</label>
              <div>
                <FaCamera style={{ cursor: "pointer", marginRight: "10px" }} />
                <input type="file" accept="image/*" onChange={handleMediaUpload} multiple />
              </div>
            </div>
            <div className="mt-3">
              <label>Viết đánh giá:</label>
              <textarea
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous(!anonymous)}
              />
              <label className="form-check-label">Đánh giá ẩn danh</label>
            </div>
            <div className="mt-3">
              <label>Dịch vụ của người bán:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  color={star <= sellerRating ? "gold" : "gray"}
                  onClick={() => setSellerRating(star)}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              ))}
            </div>
            <div className="mt-3">
              <label>Tốc độ giao hàng:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  color={star <= deliveryRating ? "gold" : "gray"}
                  onClick={() => setDeliveryRating(star)}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// === Component Mitem (Thanh menu lọc đơn hàng) ===
const Mitem = () => {
  return (
    <div className="thanh-menu" style={{ display: "flex", width: "100%" }}>
      <div className="menu1" style={{ marginRight: "25px" }}>
        <p style={{ fontWeight: "bold", borderBottom: "2px solid black" }}>All</p>
      </div>
      <div className="menu1" style={{ marginRight: "25px" }}>
        <p style={{ fontWeight: "bold" }}>To ship</p>
      </div>
      <div className="menu1" style={{ marginRight: "25px" }}>
        <p style={{ fontWeight: "bold" }}>To recelve</p>
      </div>
      <div className="menu1" style={{ marginRight: "25px" }}>
        <p style={{ fontWeight: "bold" }}>To review</p>
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
          {orderInfo.order_status === "processing"
            ? "processing"
            : orderInfo.order_status === "shipped"
            ? "shipped"
            : orderInfo.order_status === "pending"
            ? "pending"
            : orderInfo.order_status === "delivered"
            ? "delivered"
            : orderInfo.order_status === "cancelled"
            ? "cancelled"
            : "unknown"}
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
            onClick={onReview}
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
  // --- State ---
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn để xem chi tiết
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [reviewOrder, setReviewOrder] = useState(null); // Đơn hàng được chọn để đánh giá
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [showConfirmCancel, setShowConfirmCancel] = useState(null); // Trạng thái hiển thị modal xác nhận hủy

  // --- Lấy thông tin người dùng từ sessionStorage ---
  const storedUser = JSON.parse(sessionStorage.getItem("user"))?.data;
  const accountId = storedUser?.id_account;

  // --- Hàm lấy dữ liệu đơn hàng từ API ---
  const fetchOrders = async () => {
    if (!accountId) {
      console.error("Không tìm thấy ID tài khoản trong session storage");
      setLoading(false);
      return;
    }

    try {
      const response = await getOrderByAccountID(accountId);
      console.log("Dữ liệu thô từ API:", response);

      let ordersArray = [];
      if (Array.isArray(response)) {
        ordersArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        ordersArray = response.data;
      } else if (response && Array.isArray(response.orders)) {
        ordersArray = response.orders;
      } else if (response && typeof response === "object" && !Array.isArray(response)) {
        ordersArray = [response];
      } else {
        console.error("Dữ liệu API không đúng định dạng mong muốn:", response);
      }

      setOrders(ordersArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Gọi API khi component mount ---
  useEffect(() => {
    fetchOrders();
  }, [accountId, fetchOrders]);

  // --- Hàm xử lý hủy đơn hàng ---
  const handleCancelOrder = (orderId) => {
    if (!orderId) {
      console.error("Order ID không hợp lệ:", orderId);
      alert("Không thể hủy đơn hàng: ID đơn hàng không hợp lệ.");
      return;
    }
    setShowConfirmCancel(orderId); // Hiển thị modal xác nhận
  };

  const confirmCancelOrder = async (orderId) => {
    if (!orderId) {
      alert("Không thể hủy đơn hàng: ID đơn hàng không hợp lệ.");
      setShowConfirmCancel(null);
      return;
    }

    try {
      const status = { order_status: "cancelled" };
      const response = await updateOrderStatus(orderId, status);
      console.log("Phản hồi từ updateOrderStatus:", response);

      // Cập nhật state orders mà không gọi lại API
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order.id_order === orderId
            ? { ...order, order: { ...order.order, order_status: "cancelled" } }
            : order
        )
      );
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("Lỗi khi hủy đơn hàng:", errorMessage);
      alert(`Không thể hủy đơn hàng: ${errorMessage}`);

      // Làm mới danh sách đơn hàng từ server nếu có lỗi
      try {
        const response = await getOrderByAccountID(accountId);
        console.log("Danh sách đơn hàng từ server sau lỗi:", response);
        setOrders(Array.isArray(response) ? response : response.data || []);
      } catch (refreshError) {
        console.error("Lỗi khi làm mới danh sách đơn hàng:", refreshError);
      }
    } finally {
      setShowConfirmCancel(null); // Đóng modal sau khi xử lý
    }
  };

  // --- Hàm xử lý đánh giá đơn hàng ---
  const handleReviewSubmit = (data) => {
    console.log("Đánh giá đã được gửi:", data);
  };

  const onReview = (order) => {
    setReviewOrder(order); // Mở modal đánh giá
  };

  // --- Hàm xử lý xem chi tiết đơn hàng ---
  const onView = (order) => {
    setSelectedOrder(order); // Mở modal chi tiết đơn hàng
  };

  const onClose = () => {
    setSelectedOrder(null); // Đóng modal chi tiết đơn hàng
  };

  // --- Lọc đơn hàng theo từ khóa tìm kiếm ---
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const lowerQuery = searchQuery.toLowerCase();
        const firstDetail = order.order_details?.[0] || {};
        return (
          "Book Store".toLowerCase().includes(lowerQuery) ||
          (order.order?.id_order?.toString().toLowerCase() || "").includes(lowerQuery) ||
          (firstDetail.book_name || "").toLowerCase().includes(lowerQuery)
        );
      })
    : [];

  // --- Giao diện chính ---
  return (
    <>
      {/* CSS responsive */}
      <style>{`
        .container {
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          margin-right: auto;
          margin-left: auto;
        }

        /* OrderItem */
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

        /* Modal */
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

        /* Bảng sản phẩm trong modal */
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

        /* Đảm bảo bảng không tràn ra ngoài */
        .modal-body .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Sidebar cho mobile */
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

        /* Modal xác nhận */
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

        /* Responsive */
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

      {/* Giao diện chính */}
      <Navbar user={storedUser} />
      <div className="container py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <Sidebar />
          </div>

          {/* Nội dung chính */}
          <div className="col-md-9">
            <h2 style={{ marginTop: "30px" }}>My Order</h2>
            <br />
            <Mitem />
            <br />

            {/* Thanh tìm kiếm */}
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

            {/* Hiển thị danh sách đơn hàng */}
            {loading ? (
              <p>Loading...</p>
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

      {/* Modal xác nhận hủy đơn hàng */}
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

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={onClose} />}
      <Footer />
    </>
  );
};

export default MyOrder;