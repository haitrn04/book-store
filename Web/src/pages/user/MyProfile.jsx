import React, { useState } from "react";
import { Footer, Navbar } from "../../components";
import {
  FaUsers,
  FaUber,
  FaShoppingCart,
  FaDollarSign,
  FaClock,
  FaBox,
  FaList,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-white shadow position-fixed"
      style={{ width: "250px", height: "100vh", top: "90px", left: "0" }}
    >
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/managemyaccount" className="nav-link text-dark">
            <FaUsers className="me-2" /> Manage my account
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/myprofile"
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
            <FaBox className="me-2" /> My Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/addressbook" className="nav-link text-dark">
            <FaList className="me-2" /> Address Book
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/myorder" className="nav-link text-dark">
            <FaChartBar className="me-2" /> My order
          </Link>
        </li>
        <hr />
        <Link to="/" className="nav-link text-danger">
             <FaSignOutAlt className="me-2" /> Logout
        </Link>
      </ul>
   
      
    </div>
  );
};

const MyProfile = () => {
  // Tạo đối tượng user mặc định
  const [user, setUser] = useState({
    fullName: "Hieu Nguyen",
    email: "HieuNguyen@gmail.com",
    mobile: "0123456789",
    birthday: "01/01/2000", 
    phoneNumber: "0123456789",
    address: "ABC Street",
    postcode: "100000",
    province: "Hanoi",
    district: "",
    ward: "",
    gender: "Female",});
  const [editing, setEditing] = useState(false);

  // State lưu giá trị chỉnh sửa tạm thời
  const [editedUser, setEditedUser] = useState(user);

  // Khi nhấn "EDIT PROFILE", chuyển sang chế độ chỉnh sửa
  const handleEditClick = () => {
    setEditing(true);
  };

  // Khi nhấn "Cancel", quay lại chế độ xem và khôi phục giá trị ban đầu
  const handleCancelClick = () => {
    setEditing(false);
    setEditedUser(user);
  };

  // Cập nhật giá trị khi người dùng thay đổi thông tin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  // Khi nhấn "Save", lưu giá trị chỉnh sửa và thoát khỏi chế độ chỉnh sửa
  const handleSaveClick = () => {
    setUser(editedUser);
    setEditing(false);
  };
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;
  return (
    <>
      <Navbar user={storedUser} />
      <div className="container">
        <Sidebar />
        <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
          <h2 style={{ marginTop: "30px" }}>My Profile</h2>
          <br />
          <div className="card shadow-sm p-3" style={{ width: "90%", minHeight: "400px" }}>
            {editing ? (
              // Chế độ chỉnh sửa: hiển thị các input
              
              <div className="edit-form" style={{ padding: "20px" }}>
              <div className="d-flex" style={{ gap: "20px", alignItems: "flex-start" }}>
                <div className="mb-3" style={{ width: "250px" , marginRight: "20px" }}>
                  <label htmlFor="fullName" style={{ fontWeight: "bold" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    value={editedUser.fullName}
                    onChange={handleChange}
                  />
                </div>
            
                <div className="mb-3" style={{ width: "250px", marginRight: "20px" }}>
                  <label style={{ fontWeight: "bold" }}>Email Address</label>
                  <p>{user.email}</p>
                </div>
            
                <div className="mb-3" style={{ width: "250px" , marginRight: "20px" }}>
                  <label style={{ fontWeight: "bold" }}>Mobile</label>
                  <p>{user.mobile}</p>
                </div>
              </div>
              <div className="d-flex" style={{ gap: "20px", alignItems: "flex-start", marginTop: "20px" }}>
                <div className="mb-3" style={{ width: "250px" , marginRight: "20px"}}>
                  <label htmlFor="birthday" style={{ fontWeight: "bold" }}>
                    Birthday
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    className="form-control"
                    value={editedUser.birthday}
                    onChange={handleChange}
                  />
                </div>
            
                <div className="mb-3" style={{ width: "250px" , marginRight: "20px" }}>
                  <label htmlFor="gender" style={{ fontWeight: "bold" }}>
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-control"
                    value={editedUser.gender}
                    onChange={handleChange}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            
              {/* Nút Save và Cancel */}
              <div className="d-flex" style={{ gap: "20px", marginTop: "20px" }}>
                <button className="btn btn-success me-3" style={{width:"100px"}} onClick={handleSaveClick}>
                  Save
                </button>
                <button className="btn btn-secondary" style={{width:"100px"}} onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
            </div>
            
            ) : (
              // Chế độ xem: hiển thị thông tin của user
              <div>
                <div
                  className="item-s0"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    paddingLeft: "40px",
                    paddingRight: "230px",
                  }}
                >
                  <div className="item-s1">
                    <div className="item-s2">
                      <p style={{ fontWeight: "bold" }}>Full Name</p>
                    </div>
                    <div className="item-s2">
                      <p>{user.fullName}</p>
                    </div>
                  </div>
                  <div className="item-s1">
                    <div className="item-s2">
                      <p style={{ fontWeight: "bold" }}>Email Address</p>
                    </div>
                    <div className="item-s2">
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="item-s1">
                    <div className="item-s2">
                      <p style={{ fontWeight: "bold" }}>Mobile</p>
                    </div>
                    <div className="item-s2">
                      <p>{user.mobile}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="item-s0"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    paddingLeft: "40px",
                    paddingRight: "530px",
                  }}
                >
                  <div className="item-s1">
                    <div className="item-s2">
                      <p style={{ fontWeight: "bold" }}>Birthday</p>
                    </div>
                    <div className="item-s2">
                      <p>{user.birthday}</p>
                    </div>
                  </div>
                  <div className="item-s1">
                    <div className="item-s2">
                      <p style={{ fontWeight: "bold" }}>Gender</p>
                    </div>
                    <div className="item-s2">
                      <p>{user.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="button">
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "40px", width: "260px", marginTop: "15px" }}
                    onClick={handleEditClick}
                  >
                    EDIT PROFILE
                  </button>
                  <br />
                  <button className="btn btn-primary" style={{ marginLeft: "40px", width: "260px", marginTop: "15px" }}>
                    CHANGE PASSWORD
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
