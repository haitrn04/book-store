import React from "react";
// import { Link } from "react-router-dom";
import { getGenre } from "../services/apiService";
const Home = () => {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      title: "New Releases",
      description: "Discover the latest bestsellers and new titles from your favorite authors.",
      buttonText: "Explore New Books",
      link: "/category/new-releases"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      title: "Classics Collection",
      description: "Timeless literary masterpieces that have shaped generations of readers.",
      buttonText: "Browse Classics",
      link: "/category/classics"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      title: "Special Discounts",
      description: "Limited time offers on selected titles - up to 50% off!",
      buttonText: "View Deals",
      link: "/sale"
    }
  ];
  
  return (
    <>
      <div className="hero">
        {/* Bootstrap Carousel */}
        <div
          id="bookstoreCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="20000"
        >
          {/* Indicators */}
          <div className="carousel-indicators">
            {slides.map((slide, index) => (
              <button
                key={`indicator-${slide.id}`}
                type="button"
                data-bs-target="#bookstoreCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div
                key={`slide-${slide.id}`}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                style={{ height: "400px" }}
              >
                <div className="card bg-dark text-white border-0 h-100">
                  <img
                    src={slide.image}
                    className="card-img img-fluid w-100 h-100"
                    alt={slide.title}
                    style={{
                      objectFit: "cover",
                      filter: "brightness(0.7)"
                    }}
                  />
                  <div className="card-img-overlay d-flex align-items-center">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-7" style={{ zIndex: 1, marginLeft: "15%" }}>
                          <h1 className="display-4 fw-bold mb-3">{slide.title}</h1>
                          <p className="fs-5 d-none d-sm-block mb-4">
                            {slide.description}
                          </p>
                          {/* <Link to={slide.link} className="btn btn-lg btn-primary fw-semibold px-4 py-2 rounded-3">
                            {slide.buttonText}
                          </Link> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#bookstoreCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#bookstoreCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .carousel-item {
          transition: transform 2s ease-in-out; /* Tăng thời gian chuyển động lên 2 giây */
        }

      `}</style>
    </>
  );
};

export default Home;