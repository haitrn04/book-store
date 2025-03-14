import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaBox, FaList, FaChartBar, FaSignOutAlt, FaUber, FaHome } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { postAddProduct, getGenre } from "../../services/apiService";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles for toast
import { HeaderAdmin } from "../../components";
// Sidebar component
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


// AddProductForm component
const AddProductForm = () => {
  const [book_name, setBookName] = useState("");
  const [id_genre, setIdGenre] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [yopublication, setYoPublication] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [image_data, setImageData] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState([]);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenre();
        setGenre(response.data);
        if (!id_genre && response.data.length > 0) {
          setIdGenre(response.data[0].id_genre);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres");
      }
    };

    fetchGenres();
  }, [id_genre]);

  // Handle file upload
  const previewFile = (file) => {
    if (file) {
      setImageData(file);

      // Create a FileReader to read and preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
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
      toast.success("Product added successfully!");
      setBookName("");
      setAuthor("");
      setPublisher("");
      setYoPublication("");
      setPrice("");
      setDiscount("");
      setStock("");
      setDescription("");
      setImageData(null);
      setImagePreview(null);
      console.log(res);
    } catch (error) {
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="fw-bold">Add New Product</h2>
      <div className="bg-light p-4 rounded shadow-sm">
        <form onSubmit={upload} encType="multipart/form-data">
          <div className="row">
            {/* Left side - Form Fields */}
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Book Name</label>
                  <input type="text" className="form-control" value={book_name} onChange={(e) => setBookName(e.target.value)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Genres</label>
                  <select className="form-select" onChange={(e) => setIdGenre(e.target.value)} value={id_genre}>
                    {genre.map((e, index) => (
                      <option key={index} value={e.id_genre}>
                        {e.genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock</label>
                  <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Author</label>
                  <input type="text" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Publisher</label>
                  <input type="text" className="form-control" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Year of Publication</label>
                  <input type="date" className="form-control" value={yopublication} onChange={(e) => setYoPublication(e.target.value)} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Price</label>
                  <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Discount %</label>
                  <input type="number" className="form-control" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                </div>
              </div>



              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>

            {/* Right side - Image Upload */}
            <div className="col-md-4">
              <div className="card p-3 shadow-sm h-100">
                <label className="form-label fw-bold">Book Image</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  id="prod"
                  onChange={(e) => previewFile(e.target.files[0])}
                />
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="product"
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <i className="bi bi-image" style={{ fontSize: "3rem", color: "#adb5bd" }}></i>
                      <h5 className="mt-3 text-secondary">Please select an image</h5>
                      <p className="text-muted">Upload a cover image for your book</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Link to="/productsad">
              <button type="button" className="btn btn-secondary">Cancel</button>
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AddProducts page container
const AddProducts = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <AddProductForm />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddProducts;
