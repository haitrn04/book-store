import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../../components";
import { FaUsers, FaAddressCard, FaCartPlus, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getInfor, getAddress } from "../../services/apiService";
const moment = require("moment");

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
  const [address, setAddress] = useState([])
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;
  useEffect(() => {
    const getin4 = async () => {
      const response = await getInfor(storedUser.id_account);
      setUser(response.data[0]);
      }
      getin4();
      const getaddress = async () => {
        const res = await getAddress(storedUser.id_account);
        setAddress(res.data.filter(product => product.is_active)[0]);
      }
      getaddress();
    }, [storedUser.id_account]);
  let formatbth = moment(user.birthday).format("DD/MM/YYYY")

  return (
    <>
      <Navbar user={storedUser} />
      <div className="container py-4" style={{ paddingBottom: "100px" }}>
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <h2 style={{ marginTop: "30px" }}>Manage My Account</h2>
            <br />
            <div className="profile-address-container" style={{ display: "flex", gap: "50px" }}>
              <div className="personal-profile-card card shadow-sm p-3" style={{ width: "35%" }}>
                <p style={{ fontSize: "23px" }}>Personal Profile</p>
                {user ? (
                  <>
                    <div><p><strong>Name: </strong> {user.full_name || "N/A"}</p></div>
                    <div><p><strong>Email: </strong> {user.email || "N/A"}</p></div>
                    <div><p><strong>Phone Number: </strong> {user.phone_num ? `0${user.phone_num}` : "N/A"}</p></div>
                    <div><p><strong>Birthday: </strong> {formatbth}</p></div>
                  </>
                ) : (
                  <p>Loading profile...</p>
                )}
              </div>
              <div className="address-book-card card shadow-sm p-3" style={{ width: "60%" }}>
                <p style={{ fontSize: "23px" }}>Address Book</p>
                <p style={{ fontSize: "14px" }}>DEFAULT SHIPPING ADDRESS</p>
                {address ? (
                  <>
                    <p><strong>Name: </strong> {address.full_name || "N/A"}</p>
                    <p><strong>Address: </strong> {address.detailed_address || "N/A"}</p>
                    <p><strong>Phone Number: </strong> {address.phone_number ? `${address.phone_number}` : "N/A"}</p>
                  </>
                ) : (
                  <p>Loading address...</p>
                )}
              </div>
            </div>
            {/* <div className="card shadow-sm p-4 mt-4">
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
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageMyAccount;