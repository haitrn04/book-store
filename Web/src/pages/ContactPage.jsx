/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Footer, Navbar } from "../components";

const ContactPage = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data || null;

  const teamMembers = [
    {
      name: "Tran Thanh Hai",
      studentId: "725105061",
      email: "725105061@hnue.edu.vn",
      image: require("../assets/images/725105061.jpg")
    },
    {
      name: "Tran Thi Thu Giang",
      studentId: "725105057",
      email: "725105057@hnue.edu.vn",
      image: require("../assets/images/725105057.jpg")
    },
    {
      name: "Nguyen Trong Hieu",
      studentId: "725105073",
      email: "725105073@hnue.edu.vn",
      image: require("../assets/images/725105073.jpg")
    },
    {
      name: "Bui Dang Khai",
      studentId: "725105094",
      email: "725105094@hnue.edu.vn",
      image: require("../assets/images/725105094.jpg")
    },
    {
      name: "Tran Van Cao",
      studentId: "725105025",
      email: "725105025@hnue.edu.vn",
      image: require("../assets/images/725105025.jpg")
    }
  ];

  return (
    <>
      <Navbar user={storedUser} />
      <div className="container my-5 py-5">
        <h1 className="text-center mb-5" style={{
          fontWeight: "bold",
          color: "#2c3e50",
          position: "relative",
          paddingBottom: "15px"
        }}>
          Team Members
          <span style={{
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "4px",
            background: "#3498db",
            borderRadius: "2px"
          }}></span>
        </h1>

        <div className="row justify-content-center g-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm" style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "15px",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
              }}>
                <div className="card-body text-center p-4">
                  <div style={{
                    position: "relative",
                    width: "150px",
                    height: "150px",
                    margin: "0 auto 20px"
                  }}>
                    <img
                      src={member.image}
                      className="rounded-circle"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        border: "4px solid #3498db"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      right: "0",
                      bottom: "0",
                      borderRadius: "50%",
                      background: "rgba(52, 152, 219, 0.1)",
                      zIndex: "-1"
                    }}></div>
                  </div>
                  <h5 className="card-title" style={{
                    color: "#2c3e50",
                    fontWeight: "600",
                    marginBottom: "15px"
                  }}>{member.name}</h5>
                  <p className="card-text" style={{ color: "#7f8c8d" }}>
                    <strong>Student ID:</strong> {member.studentId}<br />
                    <strong>Email:</strong> 
                    <a href={`mailto:${member.email}`} 
                       style={{ 
                         color: "#3498db", 
                         textDecoration: "none",
                         transition: "color 0.3s ease"
                       }}
                       onMouseEnter={(e) => e.currentTarget.style.color = "#2980b9"}
                       onMouseLeave={(e) => e.currentTarget.style.color = "#3498db"}
                    >
                      {member.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;