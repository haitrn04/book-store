import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useSelector, useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Footer, Navbar } from "../components";
import { getProductbyID, getProductbyGenre, getBookAllReviewCount, getBookReviewbyID } from "../services/apiService";

import toast from "react-hot-toast";

const Product = () => {
  const state = useSelector((state) => state.handleCart);
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [thongKe, setThongKe] = useState({rating: 0, count: 0});
  const [review, setReview] = useState([]);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    let cartMsg = localStorage.getItem("cart-msg") || "0";
    cartMsg = parseInt(cartMsg);

    let exist = state.find((item) => item.id_book === product.id_book);

    if (exist) {
      if (exist.qty >= product.stock) {
        cartMsg += 1;
        localStorage.setItem("cart-msg", cartMsg.toString());
        if (cartMsg >= 1) {
          toast.error("Out of stock");
        }
        return;
      }
    }
    dispatch(addCart(product));
    localStorage.setItem("cart-msg", "0");
    toast.success("Added to cart");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        setLoading(true);
        setLoading2(true);

        const productResponse = await getProductbyID(id); 
        const productData = productResponse.data;
        setProduct(productData[0]);
  

        const similarResponse = await getProductbyGenre(productData[0].id_genre); 
        const similarData = similarResponse.data;
        setSimilarProducts(similarData);
  

        const reviewResponse = await getBookAllReviewCount(id); 
        const reviewData = reviewResponse.data;
        setThongKe(reviewData[0]);

        const reviewResponse2 = await getBookReviewbyID(id);
        const reviewData2 = reviewResponse2.data;
        setReview(reviewData2);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Reset loading states
        setLoading(false);
        setLoading2(false);
      }
    };
  
    fetchData();
  }, [id]);



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
  const isactive = (is_active) => {
    if (is_active) {
      return product.stock;
    } else {
      return "Out of stock";
    }
  }
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
              <p className="lead fw-bold text-secondary">Author: {product.author}</p>
              <p className="lead fw-bold text-secondary">Stock: {isactive(product.is_active)}</p>
              <p className="lead">
                <i className="fa fa-star text-warning"></i> {thongKe.rating} ({thongKe.count})
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
              {product.is_active ? (
                <div>
                  <button
                    className="btn btn-outline-dark me-3"
                    onClick={() => {
                      if (product.is_active) {
                        addProduct(product);
                      } else {
                        toast.error("Out of stock");
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                  <Link to="/cart" className="btn btn-dark">
                    Go to Cart
                  </Link>
                </div>) : (
                  <h3>This product has been discontinued.</h3>
              )}

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


  const ShowReviews = () => {
    // Hàm để render số sao dựa trên rating
    const renderStars = (rating) => {
      return Array.from({ length: 5 }).map((_, idx) => (
        <i
          key={idx}
          className={`bi ${idx < rating ? "bi-star-fill" : "bi-star"}`}
          style={{ color: idx < rating ? "#FFC107" : "#e0e0e0" }}
        ></i>
      ));
    };
  
    // Tính trung bình rating và tổng số review để hiển thị phần thống kê
    const averageRating = review.length > 0 
      ? (review.reduce((sum, rev) => sum + rev.rating, 0) / review.length).toFixed(1) 
      : 0;
    
    // Tính số lượng đánh giá cho mỗi mức sao
    const ratingCounts = Array(5).fill(0);
    review.forEach(rev => {
      if (rev.rating >= 1 && rev.rating <= 5) {
        ratingCounts[rev.rating - 1]++;
      }
    });
    
    return (
      <div className="reviews-container my-5">
        <h3 className="fw-bold mb-4 border-bottom pb-3">ĐÁNH GIÁ SẢN PHẨM</h3>
        
        {/* Phần thống kê tổng quan */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-4 text-center">
                <div className="rating-summary p-3 rounded bg-light">
                  <h2 className="display-3 fw-bold text-primary mb-3">{averageRating}</h2>
                  <p className="text-muted">trên thang điểm 5</p>
                  <div className="d-flex justify-content-center mb-0">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p className="text-muted mb-0 fw-semibold">{review.length} đánh giá</p>
                </div>
              </div>
              
              <div className="col-md-8">
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingCounts[star - 1];
                    const percentage = review.length > 0 ? (count / review.length) * 100 : 0;
                    
                    return (
                      <div key={star} className="rating-bar d-flex align-items-center mb-2">
                        <div className="stars me-2">
                          {star} <i className="bi bi-star-fill text-warning"></i>
                        </div>
                        <div className="progress flex-grow-1 me-2" style={{ height: "12px" }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${percentage}%` }} 
                            aria-valuenow={percentage} 
                            aria-valuemin="0" 
                            aria-valuemax="100">
                          </div>
                        </div>
                        <div className="count text-muted small" style={{ width: "100px" }}>
                          {count} đánh giá
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Hiển thị danh sách reviews */}
        {review.length === 0 ? (
          <div className="text-center p-5 bg-light rounded">
            <i className="bi bi-chat-square-text display-4 text-muted"></i>
            <p className="mt-3">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          </div>
        ) : (
          <div className="review-list">
            {review.map((rev, idx) => (
              <div key={idx} className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="d-flex align-items-center">
                      <div className="avatar-placeholder rounded-circle bg-primary text-white me-2 d-flex justify-content-center align-items-center" style={{ width: "40px", height: "40px" }}>
                        <span>{rev.rating}</span>
                      </div>
                      <div>
                        <h6 className="mb-0">{rev.user_name}</h6>
                        <small className="text-muted">{new Date(rev.created_at).toLocaleDateString("vi-VN", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</small>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end">
                    <div className="mb-1">
                      {renderStars(rev.rating)}
                    </div>
                    <div>
                      {rev.rating === 5 && (
                        <span className="badge bg-success">Xuất sắc</span>
                      )}
                      {rev.rating === 1 && (
                        <span className="badge bg-danger">Không hài lòng</span>
                      )}
                      {rev.rating === 4 && (
                        <span className="badge bg-info">Rất tốt</span>
                      )}
                      {rev.rating === 3 && (
                        <span className="badge bg-secondary">Tạm được</span>
                      )}
                      {rev.rating === 2 && (
                        <span className="badge bg-warning text-dark">Kém</span>
                      )}
                    </div>
                  </div>
                </div>
  
                <div className="card-body">
                  <p className="card-text mb-3">{rev.review_text || "Không có nhận xét."}</p>
  
                  {/* Hiển thị hình ảnh nếu có */}
                  {rev.image_data && (
                    <div className="review-images mb-3">
                      <h6 className="small text-muted mb-2">Hình ảnh đính kèm:</h6>
                      <div className="d-flex gap-2 flex-wrap">
                        <div className="position-relative" style={{ width: "100px", height: "100px" }}>
                          <img
                            src={`data:image/jpeg;base64,${rev.image_data}`}
                            className="img-thumbnail rounded"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            alt="Hình ảnh đánh giá"
                            onClick={() => {/* Có thể thêm chức năng xem ảnh phóng to */}}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                
                </div>
              </div>
            ))}
          </div>
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
        <ShowReviews />
      </div>
      <Footer />
    </>
  );
};

export default Product;
