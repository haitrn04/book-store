import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox,FaUber, FaList, FaChartBar, FaSignOutAlt, FaBars, FaFilter } from "react-icons/fa";

const Header = () => {
  return (
    <div className="d-flex justify-content-between align-items-center p-3 shadow-sm bg-white position-fixed"
         style={{ top: "0", left: "250px", right: "0", height: "60px", zIndex: "1000", width: "calc(100% - 250px)" }}>
      <FaBars className="text-secondary" size={24} />
      <div className="d-flex align-items-center">
        <img src="./assets/main.png.jpg" className="rounded-circle border" alt="User" height="45px" width="50px"/>
        <div className="text-end ms-2">
          <span className="d-block fw-bold">Moni Roy</span>
          <span className="text-muted">Admin</span>
        </div>
      </div>
    </div>
  );
};

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
          <Link to="/products_ad" className="nav-link text-dark">
            <FaBox className="me-2" /> Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/orderlist" className="nav-link text-white fw-bold bg-primary p-2 rounded">
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
        <FaSignOutAlt className="me-2" /> Logout
      </Link>
    </div>
  );
};

const OrderList = () => {
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilterBox, setShowFilterBox] = useState(false);
  
  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const orders = [
    { id: "00001", name: "Alan Cain", address: "8587 Frida Ports", date: "2019-09-04", bookId: "Book", status: "Completed" },
    { id: "00002", name: "Rosie Pearson", address: "979 Immanuel Ferry", date: "2019-05-28", bookId: "Book", status: "Processing" },
    { id: "00003", name: "Darrell Caldwell", address: "8587 Frida Ports", date: "2019-11-23", bookId: "Book", status: "Rejected" },
    { id: "00004", name: "Gilbert Johnston", address: "768 Destiny Lake", date: "2019-02-05", bookId: "Book", status: "Completed" },
    { id: "00005", name: "Alfred Murray", address: "543 Weimann Mountain", date: "2019-08-15", bookId: "Book", status: "Processing" },
    { id: "00006", name: "Alfred Murray", address: "543 Weimann Mountain", date: "2019-08-15", bookId: "Book", status: "Processing" },
    { id: "00007", name: "Alfred Murray", address: "543 Weimann Mountain", date: "2019-08-15", bookId: "Book", status: "Completed" },
    { id: "00008", name: "Alfred Murray", address: "543 Weimann Mountain", date: "2019-08-15", bookId: "Book", status: "On Hold" },
    { id: "00009", name: "Alfred Murray", address: "543 Weimann Mountain", date: "2019-08-15", bookId: "Book", status: "Processing" }
  ];

  const filteredOrders = orders.filter(order => 
    (selectedStatus.length === 0 || selectedStatus.includes(order.status)) &&
    (selectedDate === "" || order.date === selectedDate)
  );

  return (
    <div className="container mt-5 py-4">
        <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <Header />
      <h2 className="fw-bold">Order Lists</h2>
      <div className="d-flex align-items-center gap-3 p-3 bg-light rounded shadow-sm">
        <FaFilter size={20} className="text-secondary" />
        <div>Filter By</div>
        <input type="date" className="form-control w-auto" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <button className="btn btn-outline-dark" onClick={() => setShowFilterBox(!showFilterBox)}>Order Status</button>
        <button className="btn btn-danger" onClick={() => { setSelectedStatus([]); setSelectedDate(""); }}>Reset Filter</button>
      </div>

      {showFilterBox && (
        <div className="bg-white shadow p-3 rounded mt-2 position-absolute" style={{ zIndex: 1000 }}>
          <h5>Select Order Status</h5>
          {["Completed", "Processing", "Rejected", "On Hold", "In Transit"].map(status => (
            <button
              key={status}
              className={`btn m-1 ${selectedStatus.includes(status) ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => toggleStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}
      
      <div className="card shadow-sm p-4 mt-4">
        <table className="table table-striped mt-3">
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
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.address}</td>
                <td>{order.date}</td>
                <td>{order.bookId}</td>
                <td><span className={`badge ${order.status === 'Processing' ? 'bg-primary' : order.status === 'Rejected' ? 'bg-danger' : 'bg-success'}`}>{order.status}</span></td>
              </tr>
            ))}
          </tbody>
          <div className="d-flex mt-3">
            <button className="btn btn-light">&lt;</button>
            <button className="btn btn-light"> &gt;</button>
          </div>
        </table>
      </div>
      </div>
    </div>
  );
};

export default OrderList;
