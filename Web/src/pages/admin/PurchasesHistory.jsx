import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaUber,
  FaList,
  FaChartBar,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { HeaderAdmin } from "../../components";

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
          <Link
            to="/customer"
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
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

const PurchaseHistory = () => {
  const orders = [
    {
      id: "00001",
      name: "Christine Brooks",
      address: "089 Kutch Green Apt. 448",
      date: "2019-05-28",
      bookId: "Book",
      status: "Completed",
    },
    {
      id: "00002",
      name: "Rosie Pearson",
      address: "979 Immanuel Ferry Suite 526",
      date: "2019-05-28",
      bookId: "Book",
      status: "Processing",
    },
    {
      id: "00003",
      name: "Darrell Caldwell",
      address: "8587 Frida Ports",
      date: "2019-05-28",
      bookId: "Book",
      status: "Rejected",
    },
    {
      id: "00004",
      name: "Gilbert Johnston",
      address: "768 Destiny Lake Suite 600",
      date: "2019-05-28",
      bookId: "Book",
      status: "Completed",
    },
    {
      id: "00005",
      name: "Alan Cain",
      address: "042 Mylene Throughway",
      date: "2019-05-28",
      bookId: "Book",
      status: "Processing",
    },
    {
      id: "00006",
      name: "Alfred Murray",
      address: "543 Weimann Mountain",
      date: "2019-05-28",
      bookId: "Book",
      status: "Completed",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="badge bg-success">Completed</span>;
      case "Processing":
        return <span className="badge bg-primary">Processing</span>;
      case "Rejected":
        return <span className="badge bg-danger">Rejected</span>;
      case "On Hold":
        return <span className="badge bg-warning">On Hold</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="container mt-5 py-4">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <h2 className="fw-bold mt-4">Purchases History</h2>

        <div className="card shadow-sm p-4 mt-3">
          <table className="table table-striped">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>ADDRESS</th>
                <th>DATE</th>
                <th>BOOK ID</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.address}</td>
                  <td>{order.date}</td>
                  <td>{order.bookId}</td>
                  <td>{getStatusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-light">&lt; Prev. Date</button>
            <button className="btn btn-light">Next Date &gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
