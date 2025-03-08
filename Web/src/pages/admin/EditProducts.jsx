import React, { useState,useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers, FaBox, FaList, FaChartBar, FaSignOutAlt, FaBars, FaUber, FaHome } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProductbyID, postEditProduct, deleteProductbyID } from "../../services/apiService";

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

const AddProductForm = () => {  
  const navigate  = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_book = searchParams.get('id');
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      const response = getProductbyID(id_book);
      const data = (await response).data;
      const date = new Date(data[0].yopublication).toISOString().split('T')[0];
      data[0].yopublication= date;
      setProduct(data[0]);
      setLoading(false);
    };
    fetchProduct();
  }, [id_book]);
  const handleEdit = async (e) =>{
    e.preventDefault();
      const res = await postEditProduct(product.id_book, product.book_name, product.genres, product.author, product.publisher, product.yopublication, product.price, product.discount, product.stock, product.description);
      alert(res.data.message);
      navigate("/productsad");
  };
  const handleChange = (e) =>{ 
    const { name, value } = e.target;
    setProduct({...product, [name]: value});
  };

  const handledel = async () => {
    try {
      await deleteProductbyID(id_book);
      navigate("/productsad");
    } catch (error) {
      console.log(error);
    }
  }

    return (
      <div className="container mt-5 pt-5">
        <h2 className="fw-bold">Edit Product</h2>
        <div className="bg-light p-4 rounded shadow-sm">
          <form onSubmit={handleEdit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Book ID</label>
                <input type="text" className="form-control" name="id_book" value={product.id_book} onChange={(e) => handleChange(e)} disabled/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Book Name</label>
                <input type="text" className="form-control" name="book_name" value={product.book_name} onChange={(e) => handleChange(e)} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Genres</label>
                <select className="form-select" name="genres" value={product.genres} onChange={(e) => handleChange(e)}>
                  <option>Select Genre</option>
                  <option>Novel</option>
                  <option>Adventure</option>
                  <option>Fiction</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Author</label>
                <input type="text" className="form-control" name="author" value={product.author} onChange={(e) => handleChange(e)}/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Publisher</label>
                <input type="text" className="form-control" name="publisher" value={product.publisher} onChange={(e) => handleChange(e)} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Year of Publication</label>
                <input type="date" className="form-control" name="yopublication" value={product.yopublication} onChange={(e) => handleChange(e)}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input type="text" className="form-control" name="price" value={product.price} onChange={(e) => handleChange(e)} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Discount %</label>
                <input type="text" className="form-control" name="discount" value={product.discount} onChange={(e) => handleChange(e)} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Stock</label>
                <input type="text" className="form-control" name="stock" value={product.stock} onChange={(e) => handleChange(e)}/>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Pictures</label>
              <input type="file" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea className="form-control" name="description" rows="5" value={product.description} onChange={(e) => handleChange(e)}></textarea>
            </div>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/productsad">
                <button type="button" className="btn btn-secondary btn-lg">Cancel</button>
              </Link>
              <button type="submit" className="btn btn-danger btn-lg" onClick={handledel}>Delete</button>
              <button type="submit" className="btn btn-primary btn-lg">Edit</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  

const EditProducts = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <Header />
        <AddProductForm />
      </div>
    </div>
  );
};

export default EditProducts;
