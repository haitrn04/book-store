import React, { useState } from "react";
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


// Sidebar component
const Sidebar = () => {
  return (
    <>
      <div
        className="d-flex flex-column p-3 bg-white shadow rounded d-md-block d-none"
        style={{
          width: "250px",
          height: "calc(100vh - 100px)",
          position: "sticky",
          top: "100px"
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
        <ul className="nav justify-content-around">
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

// Dữ liệu đơn hàng mẫu
const orderData = [
  {
    id: "12345",
    storeName: "POP MART OFFICIAL STORE",
    status: "Cancelled",
    date: "5 Tháng 1, 20:00 VN",
    productName: "POP MART THE MONSTERS COCA-COLA SINGLE BOX",
    variant: "Single box",
    price: 600000,
    quantity: 1,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaYEpc4B2qC8kSHxdMwncUf29mvhGps7RVhg&s",
  },
  {
    id: "67890",
    storeName: "Official Tech Store",
    status: "Delivered",
    date: "10 Tháng 2, 15:00 VN",
    productName: "Wireless Headphones X200",
    variant: "Black",
    price: 1200000,
    quantity: 2,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdooUd9PyYKEbovMo12PeDpEpDf2sVBLfyuQ&s",
  },
];

// Component hiển thị chi tiết đơn hàng dưới dạng modal
const OrderDetailModal = ({ order, onClose }) => {
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
            <h5 className="modal-title">Order Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <table className="table">
              <tbody>
                <tr>
                  <th>Order ID</th>
                  <td>{order.id}</td>
                </tr>
                <tr>
                  <th>Store Name</th>
                  <td>{order.storeName}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{order.status}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{order.date}</td>
                </tr>
                <tr>
                  <th>Product Name</th>
                  <td>{order.productName}</td>
                </tr>
                <tr>
                  <th>Variant</th>
                  <td>{order.variant}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>{order.price.toLocaleString()} VND</td>
                </tr>
                <tr>
                  <th>Quantity</th>
                  <td>{order.quantity}</td>
                </tr>
                <tr>
                  <th>Product Image</th>
                  <td>
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị modal đánh giá
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

const Mitem = () => {
  return (
    <div
      className="thanh-menu"
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      <div className="menu1" style={{ marginRight: "25px" }}>
        <p style={{ fontWeight: "bold",borderBottom: "2px solid black"}}>All</p>
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


// Component đơn hàng item
const OrderItem = ({ order, onView, onReview }) => {
  return (
    <div
      className="order-item"
      style={{
        backgroundColor: "#f5f5fa",
        padding: "15px",
        margin: "20px 0",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{order.storeName}</p>
        <button
          style={{
            backgroundColor: 
              order.status === "Delivered" ? "#99FF99" : 
              order.status === "Cancelled" ? "#CCCC00" : "#f0f0f0",
            border: "none",
            padding: "5px 10px",
            borderRadius: "15px",
          }}
        >
          {order.status}
        </button>
      </div>
      <div className="order-details" style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
        <img
          src={order.imageUrl}
          alt="Product"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "8px",
            objectFit: "cover",
            marginRight: "15px",
          }}
        />
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0", fontWeight: "bold" }}>({order.date})</p>
          <p style={{ margin: "5px 0" }}>{order.productName}</p>
          <p style={{ color: "gray", fontSize: "12px", margin: "5px 0" }}>{order.variant}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "300px" }}>
          <p style={{ fontWeight: "bold", margin: "5px 0" }}>
            {order.price.toLocaleString()} VND
          </p>
          <p style={{ fontWeight: "bold", margin: "5px 0" }}>Qty: {order.quantity}</p>
        </div>
      </div>
      <div className="khoi" style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginTop: "15px" }}>
        <div>
          {order.status === "Delivered" && (
            <button
              className="btn btn-secondary"
              style={{
                border: "none",
                padding: "5px 10px",
                borderRadius: "15px",
              }}
              onClick={onReview}
            >
              <FaCommentDots className="me-2" /> Comment
            </button>
          )}
        </div>
        <div>
          <button
            className="btn btn-primary"
            style={{
              border: "none",
              padding: "5px 10px",
              borderRadius: "15px",
            }}
            onClick={() => onView(order)}
          >
            View order
          </button>
        </div>
        <div>
          <button
            className="btn btn-danger"
            style={{
              border: "none",
              padding: "5px 10px",
              borderRadius: "15px",
            }}
          >
            Cancel order
          </button>
        </div>
      </div>
    </div>
  );
};

// Component MyOrder chính
const MyOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewOrder, setReviewOrder] = useState(null);

  const handleReviewSubmit = (data) => {
    console.log("Review submitted:", data);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const onReview = (order) => {
    setReviewOrder(order);
  };

  const filteredOrders = orderData.filter((order) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      order.storeName.toLowerCase().includes(lowerQuery) ||
      order.id.toLowerCase().includes(lowerQuery) ||
      order.productName.toLowerCase().includes(lowerQuery)
    );
  });

  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;

  return (
    <>
      <style>{`
        /* Đảm bảo container chính co giãn tốt */
        .container {
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          margin-right: auto;
          margin-left: auto;
        }

        /* Sidebar responsive */
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
          }

          .col-md-3, .col-md-9 {
            flex: 0 0 100%;
            max-width: 100%;
          }

          /* Đảm bảo Footer không bị che bởi sidebar trên mobile */
          footer {
            margin-bottom: 70px !important;
          }
        }

        /* Thanh menu (Mitem) responsive */
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
        }

        /* OrderItem responsive */
        @media (max-width: 768px) {
          .order-details {
            display: flex;
            flex-direction: column !important;
            align-items: flex-start;
          }

          .order-details img {
            width: 80px;
            height: 80px;
            margin-bottom: 15px;
            margin-right: 0;
          }

          .khoi {
            flex-direction: column !important;
            align-items: flex-start;
            gap: 10px;
            margin-top: 15px;
          }

          .khoi div {
            width: 100%;
          }

          .khoi button {
            width: 100%;
            text-align: center;
          }

          .order-details p {
            margin: 5px 0 !important;
          }
        }

        @media (min-width: 769px) {
          .order-details {
            display: flex;
            align-items: center;
          }

          .order-details img {
            margin-right: 15px;
          }
        }

        @media (max-width: 576px) {
          .order-item {
            padding: 10px;
          }

          .order-details img {
            width: 60px;
            height: 60px;
          }

          .order-details p {
            font-size: 14px;
          }

          .khoi button {
            font-size: 14px;
            padding: 8px;
          }
        }

        /* Search bar responsive */
        @media (max-width: 576px) {
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
        }

        /* Modal responsive */
        @media (max-width: 576px) {
          .modal-dialog {
            margin: 0.5rem;
          }

          .modal-content {
            font-size: 14px;
          }

          .modal-body img {
            width: 80px;
            height: 80px;
          }

          .modal-footer button {
            width: 100%;
            margin-top: 5px;
          }
        }

        /* ReviewModal responsive */
        @media (max-width: 576px) {
          .ReviewModal .modal-body {
            padding: 10px;
          }

          .ReviewModal textarea {
            font-size: 12px;
          }

          .ReviewModal .mt-3 {
            margin-top: 10px !important;
          }
        }

        /* Điều chỉnh font-size và padding trên mobile */
        @media (max-width: 576px) {
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
            <h2 style={{ marginTop: "30px" }}>My Orders</h2>
            <br />
            <Mitem />
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
                placeholder="Search by seller name, order ID or product name"
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
            {reviewOrder && (
              <ReviewModal
                order={reviewOrder}
                onClose={() => setReviewOrder(null)}
                onSubmit={handleReviewSubmit}
              />
            )}
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onView={handleViewOrder}
                  onReview={onReview}
                />
              ))
            ) : (
              <p style={{ marginTop: "20px" }}>No orders found.</p>
            )}
          </div>
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
      )}
      <Footer />
    </>
  );
};

export default MyOrder;