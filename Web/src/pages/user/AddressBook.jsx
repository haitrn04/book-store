import React, { useState } from "react";
import { Footer, Navbar } from "../../components";
import {
  FaUsers,
  FaBox,
  FaList,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

/** Sidebar cho menu bên trái */
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
          <Link to="/myprofile" className="nav-link text-dark">
            <FaBox className="me-2" /> My Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/addressbook"
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
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

/** Trang Address Book */
const AddressBook = () => {
  // Mảng chứa các địa chỉ của người dùng
  // const [addresses, setAddresses] = useState([
  //   {
  //     fullName: "Hieu Nguyen",
  //     phoneNumber: "093722837",
  //     address: "ABC Street",
  //     postcode: "100000",
  //     province: "Hanoi",
  //     district: "",
  //     ward: "",
  //   },
  // ]);
  const [user, setUser] = useState([
    {
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
      gender: "Female",
    }
  ]);
  
  

  /* 
    editingIndex: nếu là số từ 0 đến addresses.length - 1, tức đang chỉnh sửa địa chỉ đó.
    Nếu editingIndex === addresses.length, nghĩa là đang thêm địa chỉ mới.
    Nếu editingIndex === null, không có thao tác chỉnh sửa nào.
  */
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedAddress, setEditedAddress] = useState(null);

  /** Khi nhấn "Edit" trên một dòng địa chỉ */
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedAddress({ ...user[index] });
  };

  /** Khi nhấn "+ ADD NEW ADDRESS" */
  const handleAddNew = () => {
    setEditingIndex(user.length);
    setEditedAddress({
      fullName: "",
      phoneNumber: "",
      address: "",
      postcode: "",
      province: "",
      district: "",
      ward: "",
    });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress({
      ...editedAddress,
      [name]: value,
    });
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditedAddress(null);
  };

  const handleSaveClick = () => {
    if (editingIndex === user.length) {
      setUser([...user, editedAddress]);
    } else {
      const updated = [...user];
      updated[editingIndex] = editedAddress;
      setUser(updated);
    }
    setEditingIndex(null);
    setEditedAddress(null);
  };
  

  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar />
        <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
          <h2 style={{ marginTop: "30px" }}>Address Book</h2>
          <br />

          {editingIndex !== null && editedAddress ? (
            <div className="edit-form card shadow-sm p-4 mt-4">
              <div style={{ display: "flex", gap: "40px" }}>
                <div style={{ flex: 1 }}>
                  <div className="mb-3">
                    <label htmlFor="fullName" style={{ fontWeight: "bold" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-control"
                      placeholder="First Last"
                      value={editedAddress.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="phoneNumber"
                      style={{ fontWeight: "bold" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="Please enter your phone number"
                      value={editedAddress.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  
                </div>
                <div style={{ flex: 1 }}>
                  <div className="mb-3">
                    <label htmlFor="province" style={{ fontWeight: "bold" }}>
                      Province
                    </label>
                    <select
                      id="province"
                      name="province"
                      className="form-control"
                      value={editedAddress.province}
                      onChange={handleChange}
                    >
                      <option value="">Please choose your province</option>
                      <option value="Hanoi">Hà Nội</option>
                      <option value="HCM">Hồ Chí Minh</option>
                      <option value="Danang">Đà Nẵng</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="district" style={{ fontWeight: "bold" }}>
                      District
                    </label>
                    <select
                      id="district"
                      name="district"
                      className="form-control"
                      value={editedAddress.district}
                      onChange={handleChange}
                    >
                      <option value="">Please choose your district</option>
                      <option value="District 1">District 1</option>
                      <option value="District 2">District 2</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ward" style={{ fontWeight: "bold" }}>
                      Ward
                    </label>
                    <select
                      id="ward"
                      name="ward"
                      className="form-control"
                      value={editedAddress.ward}
                      onChange={handleChange}
                    >
                      <option value="">Please choose your ward</option>
                      <option value="Ward 1">Ward 1</option>
                      <option value="Ward 2">Ward 2</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <button
                  className="btn btn-light me-3"
                  style={{ width: "100px", backgroundColor: "#f2f2f2" }}
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ width: "100px", backgroundColor: "#ff7a00", color: "#fff" }}
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm p-4 mt-4">
              <table className="table table-striped mt-3">
                <thead className="bg-light">
                  <tr>
                    <th>Full Name</th>
                    <th>Address</th>
                    <th>Postcode</th>
                    <th>Phone Number</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((item, index) => (
                    <tr key={index}>
                      <td>{item.fullName}</td>
                      <td>{item.address}</td>
                      <td>{item.postcode}</td>
                      <td>{item.phoneNumber}</td>
                      <td className="text-end">
                        <span
                          className="text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEditClick(index)}
                        >
                          Edit
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {editingIndex === null && (
            <div className="text-end mt-3">
              <button
                className="btn"
                style={{
                  backgroundColor: "#00adee",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                onClick={handleAddNew}
              >
                + ADD NEW ADDRESS
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddressBook;
