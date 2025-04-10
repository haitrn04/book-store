import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../../components";
import { FaUsers, FaAddressCard, FaCartPlus, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getInfor, getAddress } from "../../services/apiService";
const moment = require('moment');

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
            <Link to="/managemyaccount" className="nav-link text-white fw-bold bg-primary p-2 rounded">
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
            <Link to="/myorder" className="nav-link text-dark">
              <FaCartPlus className="me-2" /> My order
            </Link>
          </li>
        </ul>
      </div>

      {/* Menu ngang cho mobile */}
      <div 
        className="d-md-none bg-white shadow p-2"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          margin: 0,
          padding: "0.5rem 0",
          boxSizing: "border-box"
        }}
      >
        <ul 
          className="nav justify-content-around m-0 p-0"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          <li className="nav-item">
            <Link 
              to="/managemyaccount" 
              className="nav-link text-white fw-bold bg-primary p-2 rounded"
              style={{ margin: 0 }}
            >
              <FaUsers />
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/myprofile" 
              className="nav-link text-dark"
              style={{ margin: 0 }}
            >
              <FaUser />
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/addressbook" 
              className="nav-link text-dark"
              style={{ margin: 0 }}
            >
              <FaAddressCard />
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/myorder" 
              className="nav-link text-dark"
              style={{ margin: 0 }}
            >
              <FaCartPlus />
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

const ManageMyAccount = () => {
  const [user, setUser] = useState([]);
  const [address, setAddress] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;

  useEffect(() => {
    const getin4 = async () => {
      const response = await getInfor(storedUser.id_account);
      setUser(response.data[0]);
    }
    getin4();
    const getaddress = async () => {
      const res = await getAddress(storedUser.id_account);
      if (res.data) {
        return null;
      } else{
        setAddress(res.data[0]);
      }
      
    }
    getaddress();
  }, [storedUser.id_account]);

  const formatbth = moment(user.birthday).format("DD/MM/YYYY");

  return (
    <>
      <style>{`
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

          /* Remove any default body margin/padding that might cause whitespace */
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Stack Personal Profile and Address Book vertically on mobile */
          .profile-address-container {
            flex-direction: column !important;
          }

          .personal-profile-card, .address-book-card {
            width: 100% !important; /* Full width on mobile */
            margin-left: 0 !important; /* Remove left margin */
            margin-bottom: 20px; /* Add spacing between cards */
          }
        }
      `}</style>
      <Navbar user={storedUser} />
      <div className="container py-4" style={{ paddingBottom: "100px" }}>
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <h2 style={{ marginTop: "30px" }}>Manage My Account</h2>
            <br />
            <div className="profile-address-container" style={{ display: "flex" ,  gap: "50px" }}>
              <div className="personal-profile-card card shadow-sm p-3" style={{ width: "35%" }}>
                <p style={{ fontSize: "23px" }}>Personal Profile</p>
                <div><p><strong>Name: </strong> {user.full_name}</p></div>
                <div><p><strong>Email: </strong> {user.email}</p></div>
                <div><p><strong>Phone Number: </strong>0{user.phone_num} </p></div>
                <div><p><strong>Birthday: </strong>{formatbth}</p></div>
              </div>
              <div className="address-book-card card shadow-sm p-3" style={{ width: "60%" }}>
                <p style={{ fontSize: "23px" }}>Address Book</p>
                <p style={{ fontSize: "14px" }}>DEFAULT SHIPPING ADDRESS</p>
                <p><strong>Name: </strong> {address.full_name}</p>
                <p><strong>Address: </strong> {address.detailed_address}</p>
                <p><strong>Phone Number: </strong> 0{address.phone_number}</p>
              </div>
            </div>
            <div className="card shadow-sm p-4 mt-4">
              <h4>Recent Orders</h4>
              <table className="table table-striped mt-3">
                <thead className="bg-light">
                  <tr>
                    <th>Order#</th>
                    <th>Placed On</th>
                    <th>Items</th>
                    <th>Total</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageMyAccount;