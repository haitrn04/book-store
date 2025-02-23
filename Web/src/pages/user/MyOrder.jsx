import React, { useState } from "react";
import { Footer, Navbar } from "../../components";
import {
  FaUsers,
  FaUber,
  FaShoppingCart,
  FaDollarSign,
  FaClock,
  FaBox,
  FaList,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../../redux/action";
import { Link } from "react-router-dom";



const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-white shadow position-fixed"
      style={{ width: "250px", height: "100vh", top: "90px", left: "0" }}
    >
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/managemyaccount" className="nav-link text-dark">
            <FaUsers className="me-2" /> Manage my account
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/myprofile"
            className="nav-link text-dark"
          >
            <FaBox className="me-2" /> My Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/addressbook" className="nav-link text-dark">
            <FaList className="me-2" /> Address Book
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/myorder" className="nav-link text-white fw-bold bg-primary p-2 rounded">
            <FaChartBar className="me-2" /> My order
          </Link>
        </li>
        <hr />
        <Link to="/" className="nav-link text-danger">
            <FaSignOutAlt className="me-2" /> Logout
        </Link>
      </ul>
      
    </div>
  );
};

const Mitem = () => {

  return (
    <div className = "thanh-menu" style={{display : "flex"  , width : "100%" ,  borderBottom:"2px solid black"}}>
      <div className="menu1" style={{marginRight: "25px" }}>
        <p style={{fontWeight : "bold"  , alignItems : "center"}}>All</p>  
      </div>
      <div className="menu1" style={{marginRight: "25px" }}>
        <p style={{fontWeight : "bold"  , alignItems : "center"}}>To ship</p>  
      </div>
      <div className="menu1" style={{marginRight: "25px" }}>
        <p style={{fontWeight : "bold"  , alignItems : "center"}}>To recelve</p>  
      </div>
      <div className="menu1" style={{  marginRight: "25px"}}>
        <p style={{fontWeight : "bold"  , alignItems : "center"}}>To review</p>  
      </div>
      
    </div>
  )
};


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
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaYEpc4B2qC8kSHxdMwncUf29mvhGps7RVhg&s"
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
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdooUd9PyYKEbovMo12PeDpEpDf2sVBLfyuQ&s"
  }
];

// Tạo component con để hiển thị đơn hàng
const OrderItem = ({ order }) => (
  <div style={{ backgroundColor: "#f5f5fa", padding: "15px", margin: "20px 0", borderRadius: "8px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
      <p style={{ fontWeight: "bold" }}>{order.storeName}</p>
      <button style={{ backgroundColor: "#f0f0f0", border: "none", padding: "5px 10px", borderRadius: "15px", color: "gray" }}>{order.status}</button>
    </div>
    <div style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
      <img src={order.imageUrl} alt="Product" style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }} />
      <div style={{ marginLeft: "15px", flex: 1 }}>
        <p style={{ margin: "0", fontWeight: "bold" }}>({order.date})</p>
        <p style={{ margin: "5px 0" }}>{order.productName}</p>
        <p style={{ color: "gray", fontSize: "12px" }}>{order.variant}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontWeight: "bold", marginRight: "150px" }}>{order.price.toLocaleString()} VND</p>
        <p style={{ fontWeight: "bold", marginRight: "150px" }}>Qty: {order.quantity}</p>
      </div>
    </div>
  </div>
);

const MyOrder = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar />
        <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
          <h2 style={{ marginTop: "30px" }}>My Orders</h2>
          <br />
          <Mitem />
          <div className="search" style={{ marginTop: "20px", height: "50px", position: "relative", backgroundColor: "#f5f5fa", padding: "10px", borderRadius: "8px" }}>
            <FaSearch style={{ position: "absolute", top: "50%", left: "15px", transform: "translateY(-50%)", color: "gray" }} />
            <input type="text" placeholder="Search by seller name, order ID or product name" style={{ width: "100%", height: "30px", paddingLeft: "40px", border: "none", outline: "none", backgroundColor: "transparent", fontSize: "14px", color: "#333" }} />
          </div>
          {orderData.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyOrder;


