import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProducts, getGenre } from "../services/apiService";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState([]);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getListProducts = async () => {
      setLoading(true);
      const response = await getProducts(); // Assuming getProducts returns an axios response
      if (componentMounted) {
        setData(response.data);  // No need to use response.json(), just use response.data
        setFilter(response.data); // Same here, use response.data
        setLoading(false);
      }

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        componentMounted = false;
      };
    };

    const fetchGenres = async () => {
      try {
        const response = await getGenre();
        setGenre(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    getListProducts();
    fetchGenres();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.id_genre === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          {genre && genre.map((e) => (
            <button
              key={e.id_genre}
              className="btn btn-outline-dark btn-sm m-2"
              onClick={() => filterProduct(e.id_genre)}
            >
              {e.genre}
            </button>
          ))}
        </div>

        {filter.map((product) => (
          <div
            id={product.id_book}
            key={product.id_book}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <div className="card text-center h-100 position-relative">
              {/* Discount Badge */}
              {(parseInt(product.discount, 10) > 0) && (
                <span
                  className="badge bg-danger text-white position-absolute"
                  style={{ top: "10px", right: "10px", fontSize: "0.9rem" }}
                >
                  -{parseInt(product.discount, 10)}%
                </span>
              )}

              <img
                src={`data:image/jpeg;base64,${product.image_data}`}
                id="prodimg"
                className="card-img-top mx-auto"
                alt={product.book_name}
                style={{ height: "300px", objectFit: "contain", maxWidth: "200px" }}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {product.book_name.substring(0, 30)}
                  {product.book_name.length > 30 ? "..." : ""}
                </h5>
                <p className="card-text text-muted">
                  {product.description.substring(0, 90)}
                  {product.description.length > 90 ? "..." : ""}
                </p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item lead fw-bold text-secondary">
                  {parseInt((parseInt(product.price) * (100 - parseInt(product.discount || 0)) / 100)).toLocaleString("vi-VN")}
                  <sup>₫</sup>
                  {(parseInt(product.discount, 10) > 0) && (
                    <span className="text-danger text-decoration-line-through ms-2" style={{ fontSize: "1rem" }}>
                      {parseInt(product.price).toLocaleString("vi-VN")}
                      <sup>₫</sup>
                    </span>
                  )}
                </li>
              </ul>
              <div className="card-body">
                <Link
                  to={`/product/${product.id_book}`}
                  className="btn btn-dark m-1"
                >
                  Buy Now
                </Link>
                <button
                  className="btn btn-dark m-1"
                  onClick={() => {
                    toast.success("Added to cart");
                    addProduct(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
