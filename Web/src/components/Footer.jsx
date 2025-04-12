import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-md-4 col-lg-3 mb-4">
            <h5 className="mb-3 fw-bold text-uppercase text-primary">BookStore</h5>
            <p className="text-light opacity-75">
              Discover a world of stories with the best books at unbeatable prices.
            </p>
            <div className="mt-4 d-flex gap-3">
              <a
                className="text-light fs-5 hover-scale"
                href="https://facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                className="text-light fs-5 hover-scale"
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                className="text-light fs-5 hover-scale"
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 col-lg-2 mb-4">
            <h5 className="mb-3 fw-bold text-uppercase text-primary">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/product" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Books
                </a>
              </li>
              <li className="mb-2">
                <a href="/MyProfile" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-4 col-lg-3 mb-4">
            <h5 className="mb-3 fw-bold text-uppercase text-primary">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/contact" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  About
                </a>
              </li>
            </ul>
          </div>

        
        </div>

        <hr className="my-4 border-light opacity-25" />

        {/* Copyright */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-center text-md-start">
          <p className="text-light opacity-75 mb-2 mb-md-0">
            © {new Date().getFullYear()} BookStore. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <p href="/" className="text-light opacity-75 text-decoration-none hover-text-primary">
              Privacy Policy
            </p>
            <p href="/" className="text-light opacity-75 text-decoration-none hover-text-primary">
              Terms of Service
            </p>
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        .hover-scale:hover {
          transform: scale(1.2);
          transition: transform 0.2s ease-in-out;
        }
        .hover-text-primary:hover {
          color: #0d6efd !important;
          transition: color 0.2s ease-in-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;