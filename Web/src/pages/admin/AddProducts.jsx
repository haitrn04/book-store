import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaList, FaChartBar, FaSignOutAlt, FaBars, FaUber } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { postAddProduct, getGenre } from "../../services/apiService";
import { toast } from "react-toastify"; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles for toast

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
          <Link to="/products_ad" className="nav-link text-white fw-bold bg-primary p-2 rounded">
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
        <FaSignOutAlt className="me-2" /> Logout
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
        <img src="./assets/main.png.jpg" className="rounded-circle border" alt="User" height="45px" width="50px" />
        <div className="text-end ms-2">
          <span className="d-block fw-bold">Moni Roy</span>
          <span className="text-muted">Admin</span>
        </div>
      </div>
    </div>
  );
};

const AddProductForm = () => {
  const navigate = useNavigate();
  const [book_name, setbook_name] = useState("");
  const [id_genre, setid_genre] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [yopublication, setyopublication] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [image_data, setimage_data] = useState(null);
  const [description, setdescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState([]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenre();
        setGenre(response.data);
        if (id_genre === "") {
          setid_genre(response.data[0].id_genre);
          
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres");
      }
    };

    fetchGenres();
  }, [id_genre]);

  const upload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("book_name", book_name);
    formData.append("id_genre", id_genre);
    formData.append("author", author);
    formData.append("publisher", publisher);
    formData.append("yopublication", yopublication);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("imageData", image_data);
    formData.append("description", description);

    try {
      const res = await postAddProduct(formData);
      console.log(res);
      toast.success("Product added successfully!");
      navigate("/productsad");
    } catch (error) {
      console.log(error);
      toast.error("Failed to insert product"); 
    } finally {
      setLoading(false);
    }
  };

  const previewFile = (data) => {
    setimage_data(data);
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="fw-bold">Add New Product</h2>
      <div className="bg-light p-4 rounded shadow-sm">
        <form onSubmit={upload} encType="multipart/form-data">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Book Name</label>
              <input type="text" className="form-control" value={book_name} onChange={(e) => setbook_name(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Genres</label>
              <select className="form-select" onChange={(e) => setid_genre(e.target.value)} value={id_genre}>
                {genre && genre.map((e, index) => (
                  <option key={index} value={e.id_genre}>
                    {e.genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Author</label>
              <input type="text" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Publisher</label>
              <input type="text" className="form-control" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Year of Publication</label>
              <input type="date" className="form-control" value={yopublication} onChange={(e) => setyopublication(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Price</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Discount %</label>
              <input type="number" className="form-control" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Stock</label>
              <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Select Pictures</label>
            <input type="file" className="form-control" id="prod" onChange={(e) => previewFile(e.target.files[0])} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="5" value={description} onChange={(e) => setdescription(e.target.value)}></textarea>
          </div>
          <div className="d-flex justify-content-between">
            <Link to="/products_ad"><button type="button" className="btn btn-secondary">Cancel</button></Link>
            <button type="submit" className="btn btn-primary">Add Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddProducts = () => {
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

export default AddProducts;
