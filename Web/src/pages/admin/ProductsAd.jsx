import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaList, FaUber, FaChartBar, FaSignOutAlt, FaHome } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getProducts } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
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
          <Link to="/productsad" className="nav-link text-white fw-bold bg-primary p-2 rounded">
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
          <Link to="/customer" className="nav-link text-dark">
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

const ProductsAd = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      const response = getProducts();
      const data = (await response).data;
      setProducts(data);

      setLoading(false);
    };
    fetchProducts();
  }, []);
  const handleEdit = (id_book) => {
    navigate(`/editproducts/?id=${id_book}`);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="container mt-5 py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold">Products</h2>
            <Link to="/addproduct" className="btn btn-primary">Add Product</Link>
          </div>
          <div className="row mt-3">
            {loading ? (
              <Skeleton height={300} count={6} />
            ) : (
              products.map((product) => (
                <div key={product.id_book} className="col-md-4 mb-4">
                  <div className="card shadow-sm border-0 p-3 text-center" style={{ position: "relative" }}>
                    {/* Hiển thị discount ở góc phải trên nếu có */}
                    {parseInt(product.discount, 10) > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          fontWeight: "bold"
                        }}
                      >
                        -{parseInt(product.discount, 10)}%
                      </div>
                    )}

                    <img
                      src={`data:image/jpeg;base64,${product.image_data}`}
                      id="prodimg"
                      className="card-img-top mx-auto"
                      alt={product.book_name}
                      style={{ height: "300px", objectFit: "contain", maxWidth: "200px" }}
                    />

                    <div className="card-body">
                      <h5 className="card-title text-truncate">
                        {product.book_name.substring(0, 30)}
                        {product.book_name.length > 30 ? "..." : ""}
                      </h5>
                      <p className="fw-bold text-secondary">
                        {parseInt((parseInt(product.price) * (100 - parseInt(product.discount)) / 100)).toLocaleString("vi-VN")}
                        <sup>₫</sup>
                        {parseInt(product.discount) > 0 && (
                          <span
                            className="text-danger text-decoration-line-through ms-2"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {parseInt(product.price).toLocaleString("vi-VN")}
                            <sup>₫</sup>
                          </span>
                        )}
                      </p>

                      <div className="d-flex justify-content-center align-items-center">
                        <span className="text-warning me-2">★★★★☆</span>
                        <small className="text-muted">(131)</small>
                      </div>
                      <button
                        className="btn btn-outline-primary mt-2"
                        onClick={() => handleEdit(product.id_book)}
                      >
                        Edit Product
                      </button>
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

export default ProductsAd;
