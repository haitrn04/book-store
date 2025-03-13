import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";
import { getProductbyID, getProductbyGenre } from "../services/apiService";
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
        "Thiết kế bìa: đẹp, xem vd là biết. Đối tượng độc giả: sợ ma đừng đọc. Đọc đánh giá của bạn kia bảo in có mấy chỗ bị mờ, mik có chấp đặt thử mà thấy okela phết ấy chớ, in nét quá tr, giá gốc 102 đơ, thích thì tranh thủ tranh thủ đặt i mayni oi",
      media: [
        { type: "video", src: "../assets/video.mp4" },
        { type: "image", src: "../assets/Fiction.png" },
        { type: "image", src: "../assets/Education.png" },
      ],
      sellerReply:
        "Seller Page cảm ơn bạn đã ủng hộ nhà sách. Seller Page mong mang lại cho bạn những trải nghiệm tốt nhất về sản phẩm ạ.",
    },
    {
      user: "h**o",
      rating: 1,
      date: "2024-09-15",
      comment:
        "Thiết kế bìa: xấu. Đối tượng độc giả: sợ ma đừng đọc. Đọc đánh giá của bạn kia bảo in có mấy chỗ bị mờ, mik có chấp đặt thử mà thấy okela phết ấy chớ, in nét quá tr, giá gốc 102 đơ, thích thì tranh thủ tranh thủ đặt i mayni oi",
      media: [
        { type: "video", src: "../assets/video.mp4" },
        { type: "image", src: "../assets/Fiction.png" },
        { type: "image", src: "../assets/Education.png" },
      ],
      sellerReply:
        "Seller Page cảm ơn bạn đã ủng hộ nhà sách. Seller Page mong mang lại cho bạn những trải nghiệm tốt nhất về sản phẩm ạ.",
    },
  ];
  
  
  
  const ShowReviews = () => (
    <div className="my-5">
      <h3 className="text-xl font-semibold mb-3">ĐÁNH GIÁ SẢN PHẨM</h3>
  
      <div className="border border-yellow-200 rounded p-4 mb-4">
        <div className="flex items-center space-x-5">
        <div className="flex flex-col items-center">
      <p className="text-5xl font-bold text-red-500 leading-none">4.8 trên 5</p>
      <div className="flex mt-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <i key={idx} className="fa fa-star text-2xl" style={{ color: '#FFD700' }}></i>
        ))}
      </div>
      <br />
    </div>
    <div className="flex flex-wrap gap-2">
      {['Tất Cả', '5 Sao (288)', '4 Sao (29)', '3 Sao (11)', '2 Sao (5)', '1 Sao (4)'].map((filter, idx) => (
        <button key={idx} className="border rounded px-3 py-1 hover:bg-gray-200">
          {filter}
        </button>
      ))}
      <button className="border rounded px-3 py-1 hover:bg-gray-200">Có Bình Luận (130)</button>
      <button className="border rounded px-3 py-1 hover:bg-gray-200">Có Hình Ảnh / Video (75)</button>
    </div>
  </div>
</div>

  
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        reviews.map((review, idx) => (
          <div key={idx} className="border p-4 rounded-lg mb-5">
            <p className="font-semibold">
              {review.user}
              <div>
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <i
                    key={starIdx}
                    className="fa fa-star"
                    style={{ color: starIdx < review.rating ? "#FFD700" : "#ccc" }}
                  ></i>
                ))}
              </div>
              <div className="text-gray-300 text-xs">{review.date}</div>
            </p>
            <p className="mt-2 whitespace-pre-wrap">{review.comment}</p>
            <div className="flex gap-3 mt-3">
              {review.media.map((media, mediaIdx) =>
                media.type === 'image' ? (
                  <img
                    src={`data:image/jpeg;base64,${product.image_data}`}
                    width="60"
                    alt="review"
                    className="w-24 h-24 object-cover rounded border border-gray-300 p-1"
                  />
                ) : (
                  <img
                    src={`data:image/jpeg;base64,${product.image_data}`}
                    width="60"
                    alt="review"
                    className="w-24 h-24 object-cover rounded border border-gray-300 p-1"
                  />
                )
              )}
            </div>
            <div className="bg-gray-100 p-3 mt-3 rounded">
              <p><strong>Phản Hồi Của Người Bán:</strong> {review.sellerReply}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
  
  


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
