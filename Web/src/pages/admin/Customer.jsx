import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaList,FaUber , FaChartBar, FaSignOutAlt, FaHome } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { HeaderAdmin } from "../../components";


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
            <Link to="/customer" className="nav-link text-white fw-bold bg-primary p-2 rounded">
                <FaUber className="me-2" /> Customer
            </Link>
        </li>
      </ul>
      <hr />
      <Link to="/" className="nav-link text-danger">
        <FaHome className="me-2" /> Back to Home
      </Link>
      <Link to="/login" className="nav-link text-danger">
        <FaSignOutAlt className="me-2" />Login
      </Link>
    </div>
  );
};

const Customer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="container mt-5 py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold">Customers</h2>
            <Link to="/addproduct" className="btn btn-primary">Add New Customer</Link>
          </div>
          <div className="row mt-3">
            {loading ? (
              <Skeleton height={300} count={6} />
            ) : (
              products.map((product) => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div className="card shadow-sm border-0 p-3 text-center">
                    <img src={product.image} className="card-img-top mx-auto" alt={product.title} style={{ height: "200px", objectFit: "contain" }} />
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{product.title}</h5>
                      <div className="d-flex justify-content-center align-items-center">
                        <span>hung@gmail.com</span>
                      </div>
                      <Link to="/purchaseshistory" className="btn btn-outline-primary mt-2">Purchases history</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
