import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../../components";
import {
  FaUsers,
  FaAddressCard,
  FaCartPlus,
  FaUser,
  FaCamera,
  FaPencilAlt,
  FaLock,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getInfor, editInfor, changePass } from "../../services/apiService";
import avt from '../../assets/images/avt_default.jpg';

const moment = require('moment');

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-white shadow rounded"
      style={{
        width: "250px",
        height: "calc(100vh - 100px)",
        position: "sticky",
        top: "100px"
      }}
    >
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/managemyaccount" className="nav-link text-dark hover-bg-light rounded p-2">
            <FaUsers className="me-2" /> Manage my account
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/myprofile"
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
            <FaUser className="me-2" /> My Profile
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/addressbook" className="nav-link text-dark hover-bg-light rounded p-2">
            <FaAddressCard className="me-2" /> Address Book
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/myorder" className="nav-link text-dark hover-bg-light rounded p-2">
            <FaCartPlus className="me-2" /> My Orders
          </Link>
        </li>
      </ul>
    </div>
  );
};

const MyProfile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;

  // In the useEffect function where you fetch user data
  useEffect(() => {
    const getin4 = async () => {
      try {
        const response = await getInfor(storedUser.id_account);
        const userData = response.data[0];

        // Convert birthday to correct local date in UTC+7
        let date = '';
        if (userData.birthday) {
          // Create a moment object from the UTC date and set it to UTC+7
          const birthday = moment(userData.birthday).utcOffset('+07:00');
          // Format as YYYY-MM-DD for the date input
          date = birthday.format('YYYY-MM-DD');
        }

        setUser({
          ...userData,
          birthday: date
        });
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    if (storedUser?.id_account) {
      getin4();
    }
  }, [storedUser?.id_account]);

  // For displaying the formatted date
  const formatbth = user.birthday ?
    moment(user.birthday).utcOffset('+07:00').format("DD/MM/YYYY") : '';

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUser({
        ...user,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    } else {
      console.error("No file selected");
    }
  };


  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append('id_account', storedUser.id_account);

      if (user.full_name !== storedUser.full_name) {
        formData.append('full_name', user.full_name || '');
      }

      // Handle birthday with moment.js for consistent timezone handling
      if (user.birthday !== storedUser.birthday) {
        if (user.birthday) {
          formData.append('birthday', user.birthday);
        } else {
          formData.append('birthday', '');
        }
      }

      if (user.gender !== storedUser.gender) {
        formData.append('gender', user.gender || '');
      }

      if (user.imageFile) {
        formData.append('image_data', user.imageFile);
      }

      if ([...formData.entries()].length === 1) {
        console.log("No fields to update");
        return;
      }

      console.log([...formData.entries()]);
      await editInfor(formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh user data after successful update
      const response = await getInfor(storedUser.id_account);
      const updatedUser = response.data[0];

      // Format birthday for display in UTC+7
      let formattedBirthday = '';
      if (updatedUser.birthday) {
        formattedBirthday = moment(updatedUser.birthday)
          .utcOffset('+07:00')
          .format('YYYY-MM-DD');
      }

      // Create a modified user object with the correctly formatted birthday
      const userForSession = {
        ...updatedUser
      };

      // Update state with formatted data for display
      setUser({
        ...updatedUser,
        birthday: formattedBirthday,
        imageFile: null,
        imagePreview: null
      });

      // Store the original data in session storage
      sessionStorage.setItem('user', JSON.stringify({ data: userForSession }));
      setEditing(false);
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

 
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePasswordClick = () => setShowChangePassword(true);

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
    setErrorMessage(""); // Xóa lỗi khi hủy
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleSavePassword = async () => {
    // Kiểm tra mật khẩu mới không được trống
    if (!newPassword || !confirmNewPassword) {
      setErrorMessage("New password fields cannot be empty.");
      return;
    }

    // Kiểm tra mật khẩu mới nhập lại phải khớp
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    try {
      const response = await changePass({
        id_account: storedUser.id_account,
        oldPass: currentPassword,
        newPass: newPassword,
      });

      if (response.status === 200) {
        alert("Password changed successfully!");
        handleCancelChangePassword();
      } else {
        setErrorMessage(response.data.error || "Failed to update password.");
      }
    } catch (error) {
      setErrorMessage("Error updating password. Please try again.");
    }
  };
  
 

  return (
    <>
      <Navbar user={storedUser} />
      <div className="container py-4">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-0">
                <div className="bg-primary text-white p-4 rounded-top">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-4">
                      <img
                        src={user.imagePreview ||
                          (user.image_data ? `data:image/jpeg;base64,${user.image_data}` : avt)}
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: "100px", height: "100px", objectFit: "cover", border: "3px solid white" }}
                      />
                      {editing && (
                        <div
                          className="position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            bottom: "0",
                            right: "0",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer"
                          }}
                          onClick={() => document.getElementById("fileInput").click()}
                        >
                          <FaCamera className="text-primary" />
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            id="fileInput"
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="mb-1">{user.full_name || 'Welcome'}</h2>
                      <p className="mb-0">{user.email || ''}</p>
                    </div>
                  </div>
                </div>

                <ul className="nav nav-tabs px-4 pt-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "info" ? "active fw-bold" : ""}`}
                      onClick={() => setActiveTab("info")}
                    >
                      Personal Information
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "security" ? "active fw-bold" : ""}`}
                      onClick={() => setActiveTab("security")}
                    >
                      Security
                    </button>
                  </li>
                </ul>

                <div className="p-4">
                  {activeTab === "info" ? (
                    editing ? (
                      // Edit mode
                      <div className="edit-form">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label htmlFor="fullName" className="form-label fw-bold">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="full_name"
                              className="form-control"
                              value={user.full_name || ''}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-bold">Email Address</label>
                            <input
                              type="email"
                              className="form-control bg-light"
                              value={user.email || ''}
                              disabled
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-bold">Phone Number</label>
                            <input
                              type="text"
                              className="form-control bg-light"
                              value={user.phone_num || ''}
                              disabled
                            />
                          </div>

                          <div className="col-md-6">
                            <label htmlFor="birthday" className="form-label fw-bold">
                              Birthday
                            </label>
                            <input
                              type="date"
                              id="birthday"
                              name="birthday"
                              className="form-control"
                              value={user.birthday || ''}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-md-6">
                            <label htmlFor="gender" className="form-label fw-bold">
                              Gender
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              className="form-control"
                              value={user.gender || 'Other'}
                              onChange={handleChange}
                            >
                              <option value="Female">Female</option>
                              <option value="Male">Male</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="d-flex mt-4">
                          <button
                            className="btn btn-primary me-2 px-4"
                            onClick={handleSaveClick}
                          >
                            Save Changes
                          </button>
                          <button
                            className="btn btn-outline-secondary px-4"
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div>
                        <div className="row mb-4">
                          <div className="col-12 d-flex justify-content-end mb-3">
                            <button
                              className="btn btn-outline-primary"
                              onClick={handleEditClick}
                            >
                              <FaPencilAlt className="me-2" /> Edit Profile
                            </button>
                          </div>

                          <div className="col-md-6 mb-3">
                            <p className="text-muted mb-1">Full Name</p>
                            <p className="fs-5">{user.full_name || 'Not provided'}</p>
                          </div>

                          <div className="col-md-6 mb-3">
                            <p className="text-muted mb-1">Email Address</p>
                            <p className="fs-5">{user.email || 'Not provided'}</p>
                          </div>

                          <div className="col-md-6 mb-3">
                            <p className="text-muted mb-1">Phone Number</p>
                            <p className="fs-5">{user.phone_num || 'Not provided'}</p>
                          </div>

                          <div className="col-md-6 mb-3">
                            <p className="text-muted mb-1">Birthday</p>
                            <p className="fs-5">{formatbth || 'Not provided'}</p>
                          </div>

                          <div className="col-md-6 mb-3">
                            <p className="text-muted mb-1">Gender</p>
                            <p className="fs-5">{user.gender || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    )
                  ) : showChangePassword ? (
                    <div className="card border-0 bg-light p-4">
                      <h5 className="mb-3">Change Password</h5>
                      {errorMessage && <p className="text-danger">{errorMessage}</p>}
                      <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="d-flex">
                        <button className="btn btn-primary me-2" onClick={handleSavePassword}>
                          Save
                        </button>
                        <button className="btn btn-outline-secondary" onClick={handleCancelChangePassword}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ): (
                    // Security tab
                    <div>
                      <div className="card border-0 bg-light p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-1">Password</h5>
                            <p className="text-muted mb-0">Last changed: Never</p>
                          </div>
                          <button
                            className="btn btn-primary"
                           onClick={handleChangePasswordClick}
                          >
                            <FaLock className="me-2" /> Change Password
                          </button>
                        </div>
                      </div>

                      <div className="card border-0 bg-light p-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-1">Email Verification</h5>
                            <p className="text-muted mb-0">Status: Not verified</p>
                          </div>
                          <button
                            className="btn btn-outline-primary"
                          >
                            Verify
                          </button>
                        </div>
                      </div>

                    </div>
                    
                  )}
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

export default MyProfile;