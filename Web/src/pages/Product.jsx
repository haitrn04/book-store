import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Footer, Navbar } from "../components";
import { getProductbyID, getProductbyGenre } from "../services/apiService";
import fiction from '../assets/images/Fiction.png';
import education from '../assets/images/Education.png';

const Product = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = getProductbyID(id);
      const data = (await response).data;
      setProduct(data[0]);
      setLoading(false);
      const response2 = getProductbyGenre(data[0].id_genre);
      const data2 = (await response2).data;
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);
  console.log("sp ", product, "id ", id)
  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
<>
  <div className="container my-5 py-2">
    <div className="row">
      <div className="col-md-6 col-sm-12 py-3">
        <img
          src={`data:image/jpeg;base64,${product.image_data}`}
          id="prodimg"
          className="card-img-top mx-auto d-block"
          alt={product.book_name}
          style={{ height: "450px", objectFit: "contain", maxWidth: "450px" }}
        />
      </div>
      <div className="col-md-6 py-5">
        <h4 className="text-uppercase text-muted">{product.genre}</h4>
        <h1 className="display-5">{product.book_name}</h1>
        <p className="lead">
          {product.rating && product.rating.rate}{" "}
          <i className="fa fa-star text-warning"></i> 4.5 (10)
        </p>
        
        {/* Price and Discount Section */}
        <div className="position-relative mb-4">
          {/* Discount Badge */}
          {parseInt(product.discount, 10) > 0 && (
            <span
              className="badge bg-danger text-white position-absolute"
              style={{ top: "-10px", right: "0", fontSize: "0.9rem" }}
            >
              -{parseInt(product.discount, 10)}%
            </span>
          )}
          
          <h3 className="display-6 fw-bold text-secondary">
            {parseInt((parseInt(product.price) * (100 - parseInt(product.discount || 0)) / 100)).toLocaleString("vi-VN")}
            <sup>₫</sup>
            {parseInt(product.discount, 10) > 0 && (
              <span className="text-danger text-decoration-line-through ms-3" style={{ fontSize: "1.2rem" }}>
                {parseInt(product.price).toLocaleString("vi-VN")}
                <sup>₫</sup>
              </span>
            )}
          </h3>
        </div>

        <p className="lead">{product.description}</p>
        <button
          className="btn btn-outline-dark me-3"
          onClick={() => addProduct(product)}
        >
          Add to Cart
        </button>
        <Link to="/cart" className="btn btn-dark">
          Go to Cart
        </Link>
      </div>
    </div>
  </div>
</>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  
  const reviews = [
    {
      user: "m*****o",
      rating: 5,
      date: "2024-09-15",
      comment:
        "Cover design: beautiful, see the example to know. Target audience: don't read if you're afraid of ghosts. Read the other review mentioning some blurry print, I tried it and it was quite good actually, the print is very clear, original price is $102, if you like it, hurry up and order it now!",
      media: [
        { type: "image", src: "fiction" },
        { type: "image", src: "education" },
      ],
      sellerReply:
        "Seller Page thanks you for supporting our bookstore. We hope to provide you with the best product experience.",
    },
    {
      user: "h**o",
      rating: 1,
      date: "2024-09-15",
      comment:
        "Cover design: ugly. Target audience: don't read if you're afraid of ghosts. Read the other review mentioning some blurry print, I tried it and it was quite good actually, the print is very clear, original price is $102, if you like it, hurry up and order it now!",
      media: [
        { type: "image", src: "fiction" },
        { type: "image", src: "education" },
      ],
      sellerReply:
        "Seller Page thanks you for supporting our bookstore. We hope to provide you with the best product experience.",
    },
  ];
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <i
        key={idx}
        className={`bi ${idx < rating ? "bi-star-fill" : "bi-star"}`}
        style={{ color: idx < rating ? "#FFC107" : "#ccc" }}
      ></i>
    ));
  };
  
  const ShowReviews = () => {
    return (
      <div className="my-5">
        <h3 className="fw-bold mb-4">PRODUCT REVIEWS</h3>
  
        <div className="card mb-4 border-warning">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 text-center border-end">
                <h2 className="display-4 fw-bold text-danger mb-0">4.8</h2>
                <p className="text-muted">out of 5</p>
                <div className="d-flex justify-content-center mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <i
                      key={idx}
                      className="bi bi-star-fill fs-4 me-1"
                      style={{ color: "#FFC107" }}
                    ></i>
                  ))}
                </div>
                <p className="text-muted">337 reviews</p>
              </div>
  
              <div className="col-md-8">
                <div className="row g-2">
                  <div className="col-12">
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        All
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        5 Stars (288)
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        4 Stars (29)
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        3 Stars (11)
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        2 Stars (5)
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        1 Star (4)
                      </button>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        <i className="bi bi-chat-text me-1"></i>With Comments (130)
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        <i className="bi bi-image me-1"></i>With Images / Videos (75)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="card mb-4 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">{review.user}</h6>
                  <small className="text-muted">{review.date}</small>
                </div>
                <div>
                  {review.rating === 5 && (
                    <span className="badge bg-success me-2">Excellent</span>
                  )}
                  {review.rating === 1 && (
                    <span className="badge bg-danger me-2">Unsatisfied</span>
                  )}
                  <span>{renderStars(review.rating)}</span>
                </div>
              </div>
  
              <div className="card-body">
                <p className="card-text mb-3">{review.comment}</p>
  
                {review.media.length > 0 && (
                  <div className="d-flex gap-2 mb-3">
                    {review.media.map((media, mediaIdx) => (
                      <div
                        key={mediaIdx}
                        className="position-relative"
                        style={{ width: "80px", height: "80px" }}
                      >
                        {media.type === "image" ? (
                          <img
                            src={`data:image/jpeg;base64,${product.image_data}`}
                            className="img-thumbnail"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            alt="Review"
                          />
                        ) : (
                          <div
                            className="position-relative img-thumbnail"
                            style={{ width: "100%", height: "100%" }}
                          >
                            <img
                              src={`data:image/jpeg;base64,${product.image_data}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              alt="Video thumbnail"
                            />
                            <i
                              className="bi bi-play-circle position-absolute"
                              style={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "1.5rem",
                                color: "white",
                              }}
                            ></i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
  
                {review.sellerReply && (
                  <div className="card bg-light border-0">
                    <div className="card-body py-2">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-shop me-2"></i>
                        <strong>Seller's Response:</strong>
                      </div>
                      <p className="mb-0 ms-4">{review.sellerReply}</p>
                    </div>
                  </div>
                )}
              </div>
  
              <div className="card-footer bg-white text-end border-top-0">
                <button className="btn btn-outline-secondary btn-sm me-2">
                  <i className="bi bi-hand-thumbs-up me-1"></i>Helpful
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-flag me-1"></i>Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  
  


  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id_book} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={`data:image/jpeg;base64,${item.image_data}`}
                    alt="Card"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.book_name.substring(0, 15)}...
                    </h5>
                  </div>
                  {/* <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${product.price}</li>
                  </ul> */}
                  <div className="card-body">
                    <Link
                      to={"/product/" + item.id_book}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar user={storedUser} />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
        <ShowReviews/>
      </div>
      <Footer />
    </>
  );
};

export default Product;
