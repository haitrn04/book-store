import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaList, FaChartBar, FaSignOutAlt, FaTrash, FaEdit, FaUber, FaHome } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
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
          <Link to="" className="nav-link text-white fw-bold bg-primary p-2 rounded">
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


const ProductStock = () => {
const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [products, setProducts] = useState([
    { id: 1, name: "Don Quixote", category: "Novel", price: "$690.00", stock: 63, discount: "10%", image: "https://tse3.mm.bing.net/th?id=OIP.j9tMzmykzMO91hx8AxwEswHaKr&pid=Api&P=0&h=220" },
    { id: 2, name: "Alice's Adventures in Wonderland", category: "Fiction", price: "$420.00", stock: 52, discount: "10%", image: "https://tse1.mm.bing.net/th?id=OIP.pDF8HHUh5vGfo-awWhRuyQHaK7&pid=Api&P=0&h=220" },
    { id: 3, name: "Treasure Island", category: "Adventure", price: "$500.00", stock: 40, discount: "5%", image: "https://tse1.mm.bing.net/th?id=OIP.YhY7VSaEqTrBWUp9pp0U7AHaJ4&pid=Api&P=0&h=220" }
  ]);

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeleteModal(false);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock: newStock } : p));
    setShowEditModal(false);
  };
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="container mt-5 py-4">
          <h2 className="fw-bold">Product Stock</h2>
          <table className="table table-striped mt-3">
            <thead className="bg-light">
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Discount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td><img src={product.image} alt={product.name} height="50"/></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.discount}</td>
                  <td>
                    <button className="btn btn-outline-danger me-2" onClick={() => handleDelete(product)}><FaTrash /></button>
                    <button className="btn btn-outline-primary" onClick={() => handleEdit(product)}><FaEdit /></button>
                  </td>
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
      {showDeleteModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h4 className="fw-bold">Delete Stock</h4>
              <p>Are you sure you want to delete <b>{selectedProduct?.name}</b>?</p>
              <div className="alert alert-warning">⚠️ Warning: This product will be marked as sold out!</div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
          <center>
            <h4 className="fw-bold">Edit Stock</h4>
              <p>Type number to change the product stock<br /> If 0 it will be display sold out!</p>
              <input type="number" className="form-control" value={newStock} onChange={(e) => setNewStock(Number(e.target.value))} />
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmEdit}>Apply</button>
              </div>
              </center>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStock;
