import React from 'react'
import { Footer, Navbar } from "../components";
const AboutPage = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;

  return (
    <>
      <Navbar user={storedUser} />
      <div className="container my-3 py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        <p className="lead text-center">
          We are a passionate team of developers who share a love for books and reading. Our platform is crafted to help you effortlessly discover the books you are searching for, offering a diverse collection spanning across various categories. We continuously refresh and expand our library to ensure you have access to the latest and most outstanding titles. Additionally, our expert team is always here to guide and support you in finding your next great read. We are committed to providing you with an exceptional experience, and we are confident that you will find the perfect book to suit your taste. We are excited to be part of your reading journey and look forward to helping you discover the books that will inspire, entertain, and enlighten you.
        </p>

        <h2 className="text-center py-4">Our Products</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={require("../assets/images/Action.png")} alt="" />
              <div className="card-body">
                <h5 className="card-title text-center">Action</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={require("../assets/images/Education.png")} alt="" />
              <div className="card-body">
                <h5 className="card-title text-center">Education</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={require("../assets/images/Fiction.png")} alt="" />
              <div className="card-body">
                <h5 className="card-title text-center">Fiction</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={require("../assets/images/Political Fiction.png")} alt="" />
              <div className="card-body">
                <h5 className="card-title text-center">Political Fiction</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage