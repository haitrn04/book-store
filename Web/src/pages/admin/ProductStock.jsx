
import { FaUsers, FaBox, FaList, FaChartBar, FaSignOutAlt, FaTrash, FaEdit, FaUber, FaHome } from "react-icons/fa";
import { HeaderAdmin } from "../../components";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProductbyID, postEditProduct, getProductbyID } from "../../services/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const response = await getProducts();
        const productsWithGenre = await Promise.all(response.data.map(async (product) => {
            const genreResponse = await getProductbyID(product.id_book);
            return { ...product, genre: genreResponse.data[0]?.genre || "Unknown" };
        }));
        setProducts(productsWithGenre);
    } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products!");
    }
};

  

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setShowEditModal(true);
  };
  
  const confirmEdit = async () => {
    if (newStock === "" || isNaN(newStock) || Number(newStock) < 0) {
        toast.error("Stock value must be a valid non-negative number!");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("id_book", selectedProduct.id_book);
        formData.append("stock", newStock);
        
        const response = await postEditProduct(formData);

        console.log("API Response:", response);

        if (response.status === 200 && response.data.message === "Book edited successfully") {
            toast.success("Stock updated successfully!");
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id_book === selectedProduct.id_book ? { ...p, stock: Number(newStock) } : p
                )
            );
        } else {
            toast.error("Failed to update stock! Please try again.");
        }
    } catch (error) {
        console.error("Error updating stock:", error);
        toast.error("Failed to update stock!");
    }

    setShowEditModal(false);
};




const handleDelete = (product) => {
  setSelectedProduct(product);
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  try {
    const response = await deleteProductbyID(selectedProduct.id_book);
    
    if (response.status === 200) {
      setProducts(products.filter(p => p.id_book !== selectedProduct.id_book));
      toast.success("Product deleted successfully!");
    } else {
      toast.error("Failed to delete product! Please try again.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error("Failed to delete product!");
  }
  setShowDeleteModal(false);
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
              {products.map(product => (
                <tr key={product.id_book}>
                  <td><img src={`data:image/jpeg;base64,${product.image_data}`} alt={product.book_name} style={{ height: "58px", objectFit: "contain", maxWidth: "200px" }} /></td>
                  <td>{product.book_name}</td>
                  <td>{product.genre}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.discount}%</td>
                  <td>
                    <button className="btn btn-outline-danger me-2" onClick={() => handleDelete(product)}><FaTrash /></button>
                    <button className="btn btn-outline-primary" onClick={() => handleEdit(product)}><FaEdit /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showDeleteModal && (
  <div className="modal d-block bg-dark bg-opacity-50">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-3">
        <h4 className="fw-bold text-danger">Confirm Delete</h4>
        <p>Are you sure you want to delete this product: <strong>{selectedProduct?.book_name}</strong>?</p>
        <div className="d-flex justify-content-end mt-3">
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
        <h4 className="fw-bold text-primary">Edit Stock</h4>
        <p><strong>Product:</strong> {selectedProduct?.book_name}</p>
        <label className="form-label fw-bold">New Stock Value:</label>
        <input 
          type="number" 
          className="form-control"
          min="0"
          value={newStock} 
          onChange={(e) => setNewStock(e.target.value)} 
        />
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={confirmEdit}>Update</button>
        </div>
      </div>
    </div>
  </div>
)}

      <ToastContainer />
    </div>
  );
};


export default ProductStock;
