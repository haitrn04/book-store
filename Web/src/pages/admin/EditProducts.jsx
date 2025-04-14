import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaList,
  FaChartBar,
  FaSignOutAlt,
  FaUber,
  FaHome,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getProductbyID,
  postEditProduct,
  deleteProductbyID,
  getGenre,
} from "../../services/apiService";
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
          <Link
            to="/productsad"
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
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
        <FaSignOutAlt className="me-2" />
        Logout
      </Link>
    </div>
  );
};

const AddProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_book = searchParams.get("id");
  const [product, setProduct] = useState([]);
  const [id_genre, setIdGenre] = useState("");
  const [image_data, setImageData] = useState(null);
  const [genre, setGenre] = useState([]);
  const [loading, setLoading] = useState(true);
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
      }
    };

    fetchGenres();
  }, [id_genre]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = getProductbyID(id_book);
      const data = (await response).data;
      const date = new Date(data[0].yopublication).toISOString().split("T")[0];
      data[0].yopublication = date;
      setIdGenre(data[0].id_genre);
      setProduct(data[0]);
      setLoading(false);
    };
    fetchProduct();
  }, [id_book]);
  console.log(product);
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("id_book", product.id_book);
    formData.append("book_name", product.book_name);
    formData.append("id_genre", id_genre);
    formData.append("author", product.author);
    formData.append("publisher", product.publisher);
    formData.append("yopublication", product.yopublication);
    formData.append("price", product.price);
    formData.append("discount", product.discount);
    formData.append("stock", product.stock);
    formData.append("description", product.description);
    if (image_data) {
      formData.append("imageData", image_data);
    }
    try {
      const res = await postEditProduct(formData);
      alert(res.data.message);
      navigate("/productsad");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageData(file);
      setProduct({ ...product, image_data: reader.result.split(",")[1] });
    };
  };
  const handlegerne = (e) => {
    setIdGenre(e.target.value);
  };
  const handledel = async () => {
    try {
      await deleteProductbyID(id_book);
      navigate("/productsad");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="bg-light p-4 rounded shadow-sm">
        <form
          onSubmit={handleEdit}
          className="container p-4 bg-light shadow rounded"
          style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
        >
          <h3 className="text-center mb-4">Edit Book Information</h3>

          <div className="row g-4">
            {/* Left side - Image */}
            <div className="col-md-5">
              <div className="card p-3 shadow-sm h-100 w-100">
                <label className="form-label fw-bold">Book Image</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  id="prod"
                  onChange={(e) => previewFile(e.target.files[0])}
                />
                <div
                  className="text-center d-flex align-items-center justify-content-center"
                  style={{ minHeight: "400px", width: "100%" }}
                >
                  <img
                    src={`data:image/jpeg;base64,${product.image_data}`}
                    alt="product"
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>

            {/* Right side - Book Information */}
            <div className="col-md-7">
              <div className="card p-3 shadow-sm h-100 w-100">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Book ID</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="id_book"
                      value={product.id_book}
                      disabled
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-bold">Book Name</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="book_name"
                      value={product.book_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3 mt-2 w-100">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Author</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="author"
                      value={product.author}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Genres</label>
                    <select
                      className="form-select w-100"
                      onChange={handlegerne}
                      value={id_genre}
                    >
                      {genre.map((e, index) => (
                        <option key={index} value={e.id_genre}>
                          {e.genre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mt-2 w-100">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Publisher</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="publisher"
                      value={product.publisher}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      Year of Publication
                    </label>
                    <input
                      type="date"
                      className="form-control w-100"
                      name="yopublication"
                      value={product.yopublication}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3 mt-2 w-100">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Price</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Discount %</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="discount"
                      value={product.discount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Stock</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="stock"
                      value={product.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-3 w-100">
                  <label className="form-label fw-bold">Content</label>
                  <textarea
                    className="form-control w-100"
                    name="description"
                    rows="4"
                    value={product.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4 w-100">
                <Link to="/productsad">
                  <button type="button" className="btn btn-secondary">
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="btn btn-danger"
                  onClick={handledel}
                >
                  Delete
                </button>
                <button type="submit" className="btn btn-primary">
                  Edit
                </button>
              </div>
            </div>
          </div>
          <br />
          <br />
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
        <HeaderAdmin />
        <AddProductForm />
      </div>
    </div>
  );
};

export default EditProducts;
