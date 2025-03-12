import React, { useState, useEffect } from "react";

import { Footer, Navbar } from "../../components";
import { FaUsers, FaAddressCard, FaCartPlus, FaUser, } from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getInfor, getAddress } from "../../services/apiService";
const moment = require('moment');

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
      setAddress(res.data[0]);
    }
    getaddress();
  }, [storedUser.id_account]);
  const formatbth = moment(user.birthday).format("DD/MM/YYYY")
  return (
    <>
      <Navbar user={storedUser} />
      <div className="container py-4">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <h2 style={{ marginTop: "30px" }}>Manage My Account</h2>
            <br />
            <div style={{ display: "flex" }}>
              <div className="card shadow-sm p-3" style={{ width: "35%" }}>
                <p style={{ fontSize: "23px" }}>Personal Profile</p>
                <div><p><strong>Name: </strong> {user.full_name}</p></div>
                <div><p><strong>Email: </strong> {user.email}</p></div>
                <div><p><strong>Phone Number: </strong>0{user.phone_num} </p></div>
                <div><p><strong>Birthday: </strong>{formatbth}</p></div>
              </div>
              <div className="card shadow-sm p-3" style={{ left: "50px", width: "60%" }}>
                <div className="s0" style={{ display: "flex" }}>
                  <div className="s1" style={{ width: "40%" }}>
                    <p style={{ fontSize: "23px" }}>Address Book</p>
                    <p style={{ fontSize: "14px" }}>DEFAULT SHIPPING ADDRESS</p>
                    <p><strong>Name:  </strong> </p>
                    <p><strong>Address: </strong></p>
                    <p><strong>Phone Number: </strong></p>
                  </div>
                  <div className="s1" style={{ marginTop: "89px" }}>
                    <p>{address.full_name}</p>
                    <p>{address.detailed_address}</p>
                    <p>0{address.phone_number}</p>
                  </div>

                </div>
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
  )
}





const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-white shadow rounded"
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
  );
};

export default ManageMyAccount