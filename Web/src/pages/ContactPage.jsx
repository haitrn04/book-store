/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Footer, Navbar } from "../components";

const ContactPage = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data || null;

  return (
    <>
      <Navbar user={storedUser} />
      <div className="container my-3 py-3">
        <h1 className="text-center">Thông tin thành viên </h1>
        <hr />
        <div className="row my-4">
          {/* 3 thành viên ở hàng trên */}
          <div className="col-md-4 mb-4">
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            // eslint-disable-next-line react/jsx-no-comment-textnodes
            }}>
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                className="img-fluid rounded-circle"
                src={require("../assets/images/725105061.jpg")}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "20px auto",
                  border: "none",
                }}
              />
              <div className="text-center">
                <h5>Trần Thanh Hải</h5>
                <p>
                  <strong>MSV:</strong> 725105061<br />
                  <strong>Email:</strong> 725105061@hnue.edu.vn
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img
                className="img-fluid rounded-circle"
                src={require("../assets/images/725105057.jpg")}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "20px auto",
                  border: "none",
                }}
              />
              <div className="text-center">
                <h5>Trần Thị Thu Giang</h5>
                <p>
                  <strong>MSV:</strong> 725105057<br />
                  <strong>Email:</strong> 725105057@hnue.edu.vn
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img
                className="img-fluid rounded-circle"
                src={require("../assets/images/725105073.jpg")}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "20px auto",
                  border: "none",
                }}
              />
              <div className="text-center">
                <h5>Nguyễn Trọng Hiếu</h5>
                <p>
                  <strong>MSV:</strong> 725105073<br />
                  <strong>Email:</strong> 725105073@hnue.edu.vn
                </p>
              </div>
            </div>
          </div>
          {/* 2 thành viên ở hàng dưới */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div className="col-md-4 mb-4">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <img
                  className="img-fluid rounded-circle"
                  src={require("../assets/images/725105094.jpg")}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    margin: "20px auto",
                    border: "none",
                  }}
                />
                <div className="text-center">
                  <h5>Bùi Đăng Khải</h5>
                  <p>
                    <strong>MSV:</strong> 725105094<br />
                    <strong>Email:</strong> 725105094@hnue.edu.vn
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <img
                  className="img-fluid rounded-circle"
                  src={require("../assets/images/725105025.jpg")}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    margin: "20px auto",
                    border: "none",
                  }}
                />
                <div className="text-center">
                  <h5>Trần Văn Cao</h5>
                  <p>
                    <strong>MSV:</strong> 725105025<br />
                    <strong>Email:</strong> 725105025@hnue.edu.vn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
