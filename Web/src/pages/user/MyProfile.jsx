import React, { useState, useEffect } from "react";
import { Navbar } from "../../components";
import {
  FaUsers,
  FaAddressCard,
  FaCartPlus,
  FaUser,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getInfor, editInfor } from "../../services/apiService";
import avt from '../../assets/images/avt_default.jpg';

const moment = require('moment');

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
            <FaUser className="me-2" /> My Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/addressbook" className="nav-link text-dark">
            <FaAddressCard className="me-2" /> Address Book
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/myorder" className="nav-link text-dark">
            <FaCartPlus className="me-2" /> My order
          </Link>
        </li>

      </ul>


    </div>
  );
};

const MyProfile = () => {
  // Tạo đối tượng user mặc định
  const [user, setUser] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;
  useEffect(() => {
    const getin4 = async () => {
      const response = await (getInfor(storedUser.id_account));
      const date = new Date(response.data[0].birthday).toISOString().split('T')[0];
      response.data[0].birthday = date;
      setUser(response.data[0]);
    }
    getin4();

  }, [storedUser.id_account]);

  const [editing, setEditing] = useState(false);


  const formatbth = moment(user.birthday).format("DD/MM/YYYY");

  // Khi nhấn "EDIT PROFILE", chuyển sang chế độ chỉnh sửa
  const handleEditClick = () => {
    setEditing(true);
  };

  // Khi nhấn "Cancel", quay lại chế độ xem và khôi phục giá trị ban đầu
  const handleCancelClick = () => {
    setEditing(false);
  };

  // Cập nhật giá trị khi người dùng thay đổi thông tin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Khi nhấn "Save", lưu giá trị chỉnh sửa và thoát khỏi chế độ chỉnh sửa
  // const handleSaveClick = () => {
  //   setUser(editedUser);
  //   setEditing(false);
  // };

  const handleSaveClick = () => {
    const post = async () => {
      try {
        await editInfor(user);
      } catch (error) {
        console.log(error);
      }
    };
    post();
    setEditing(false);
  };


  // Up load ảnh 
  // Thêm useState để lưu hình ảnh
  const [selectedImage, setSelectedImage] = useState(user.image_data);

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setUser({
          ...user,
          image_data: selectedImage,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Up load ảnh 


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
                  <div className="mb-3" style={{ width: "250px", marginRight: "20px" }}>
                    <label htmlFor="fullName" style={{ fontWeight: "bold" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="full_name"
                      className="form-control"
                      value={user.full_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3" style={{ width: "250px", marginRight: "20px" }}>
                    <label style={{ fontWeight: "bold" }}>Email Address</label>
                    <p>{user.email}</p>
                  </div>

                  <div className="mb-3" style={{ width: "250px", marginRight: "20px" }}>
                    <label style={{ fontWeight: "bold" }}>Mobile</label>
                    <p>{user.phone_num}</p>
                  </div>
                </div>
                <div className="Khoi1-1" style={{ display: "flex" }}>
                  <div className="Khoi2" style={{ marginRight: "10px" }}>
                    <div className="d-flex" style={{ gap: "20px", alignItems: "flex-start", marginTop: "20px" }}>
                      <div className="mb-3" style={{ width: "250px", marginRight: "20px" }}>
                        <label htmlFor="birthday" style={{ fontWeight: "bold" }}>
                          Birthday
                        </label>
                        <input
                          type="date"
                          id="birthday"
                          name="birthday"
                          className="form-control"
                          value={user.birthday}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3" style={{ width: "250px", marginRight: "20px" }}>
                        <label htmlFor="gender" style={{ fontWeight: "bold" }}>
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          className="form-control"
                          value={user.gender}
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
                      <button className="btn btn-success me-3" style={{ width: "100px" }} onClick={handleSaveClick}>
                        Save
                      </button>
                      <button className="btn btn-secondary" style={{ width: "100px" }} onClick={handleCancelClick}>
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="Khoi2">
                    <p style={{ fontWeight: "bold" }}>Ảnh đại diện</p>
                    <div className="img">
                      <img
                        src={selectedImage}
                        alt="User Avatar"
                        style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
                      />
                    </div>
                    {/* Input ẩn để chọn ảnh */}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      id="fileInput"
                      onChange={handleImageUpload}
                    />
                    {/* Nút upload ảnh */}
                    <button
                      className="btn-upload-anh"
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      Up image
                    </button>
                  </div>
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
                      <p>{user.full_name}</p>
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
                      <p style={{ fontWeight: "bold" }}>Phone Number</p>
                    </div>
                    <div className="item-s2">
                      <p>{user.phone_num}</p>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className="Khoi" style={{ display: "flex" }}>
                  <div className="Sua">
                    <div
                      className="item-s0"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "10px",
                        paddingLeft: "40px",
                        paddingRight: "200px",
                      }}
                    >
                      <div className="item-s1" style={{ width: "200px" }}>
                        <div className="item-s2">
                          <p style={{ fontWeight: "bold" }}>Birthday</p>
                        </div>
                        <div className="item-s2">
                          <p>{formatbth}</p>
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
                  <div className="SuaImg">
                    <p style={{ fontWeight: "bold" }}>Ảnh đại điện</p>
                    <div className="img" >
                      <img
                        src={user.image_data || avt}  // Ưu tiên ảnh đã lưu
                        alt="User Avatar"
                        style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
                      />
                    </div>
                  </div>
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
