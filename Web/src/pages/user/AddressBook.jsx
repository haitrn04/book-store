import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../../components";
import {
  FaUsers,
  FaSignOutAlt,
  FaAddressCard,
  FaCartPlus,
  FaUser,

} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getAddress, postAddress, deleteAddress } from "../../services/apiService";
import axios from "axios";
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
            <FaUser className="me-2" /> My Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/addressbook"
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
            <FaAddressCard className="me-2" /> Address Book
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/myorder" className="nav-link text-dark">
            <FaCartPlus className="me-2" /> My order
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

  // tạo đối tượng user mặc định 

  const [address, setAddress] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem('user'))?.data;
  useEffect(() => {
    const getaddress = async () => {
      try {
        const response = await (getAddress(storedUser.id_account));
        setAddress(response.data);
        console.log("address", response.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin address:", error);
      }
    };

    getaddress();
  }, [storedUser?.id_account]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/?depth=1").then((response) => {
      setProvinces(response.data);
    });
  }, []);

  const handleProvinceChange = async (event) => {
    handleChange(event);
    const provinceCode = (event.target.value.split(",")[0]);
    console.log(provinceCode);
    if (provinceCode) {
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      setDistricts(response.data.districts);
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  const handleDistrictChange = async (event) => {
    handleChange(event);
    const districtCode = (event.target.value.split(",")[0]);
    console.log(districtCode);
    if (districtCode) {
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(response.data.wards);
    } else {
      setWards([]);
    }
  };

  // const handleProvinceChange = async (event) => {
  //   const provinceCode = event.target.value;
  //   const selectedProvince = provinces.find((p) => p.code === parseInt(provinceCode));
  
  //   setEditedAddress({
  //     ...editedAddress,
  //     province: selectedProvince ? selectedProvince.name : "",
  //     district: "",
  //     ward: "",
  //   });
  
  //   if (provinceCode) {
  //     const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
  //     setDistricts(response.data.districts);
  //     setWards([]);
  //   } else {
  //     setDistricts([]);
  //     setWards([]);
  //   }
  // };
  
  // const handleDistrictChange = async (event) => {
  //   const districtCode = event.target.value;
  //   const selectedDistrict = districts.find((d) => d.code === parseInt(districtCode));
  
  //   setEditedAddress({
  //     ...editedAddress,
  //     district: selectedDistrict ? selectedDistrict.name : "",
  //     ward: "",
  //   });
  
  //   if (districtCode) {
  //     const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
  //     setWards(response.data.wards);
  //   } else {
  //     setWards([]);
  //   }
  // };
  
  // const handleWardChange = (event) => {
  //   const wardCode = event.target.value;
  //   const selectedWard = wards.find((w) => w.code === parseInt(wardCode));
  
  //   setEditedAddress({
  //     ...editedAddress,
  //     ward: selectedWard ? selectedWard.name : "",
  //   });
  // };
  

  /* 
    editingIndex: nếu là số từ 0 đến addresses.length - 1, tức đang chỉnh sửa địa chỉ đó.
    Nếu editingIndex === addresses.length, nghĩa là đang thêm địa chỉ mới.
    Nếu editingIndex === null, không có thao tác chỉnh sửa nào.
  */
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedAddress, setEditedAddress] = useState({
    full_name: "",
    phone_number: "",
    detailed_address: "",
  });
 // handle phần tỉnh huyện riêng 
  /** Khi nhấn "Edit" trên một dòng địa chỉ */
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedAddress({ ...address[index] });
  };

  /** Khi nhấn "+ ADD NEW ADDRESS" */
  const handleAddNew = () => {
    setEditingIndex(address.length);
  };


  /** Khi nhấn "Delete" */
  /** Khi nhấn "Delete" */

  const handleDelete = async (index) => {
    if (!address || address.length === 0) return;

    const addressId = address[index]?.address_id;
    if (!addressId) return;

    try {
        await deleteAddress(addressId);
        setAddress((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
        console.error("Failed to delete address:", error);
    }
  };

  


  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress({
      ...editedAddress,
      [name]: value,
    });
  };

  /** khi nhấn "Cancel"*/ 
  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditedAddress(null);
  };

  /** khi nhấn "Save" */
  const handleSaveClick = async () => {
    try {
      await postAddress({
        id_account: storedUser.id_account,
        ...editedAddress,
        province: editedAddress.province.split(',')[1],
        district: editedAddress.district.split(',')[1],
        ward: editedAddress.ward.split(',')[1]
      });
      if (editingIndex === address.length) {
        setAddress([...address, editedAddress]);
      } else {
        const updated = [...address];
        updated[editingIndex] = editedAddress;
        setAddress(updated);
      }
      setEditingIndex(null);
      setEditedAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };


  return (
    <>
      <Navbar user={storedUser} />
      <div className="container">
        <Sidebar />
        <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
          <h2 style={{ marginTop: "30px" }}>Address Book</h2>
          <br />

          {editingIndex !== null && editedAddress ? (
            <form className="edit-form card shadow-sm p-4 mt-4">
              <div style={{ display: "flex", gap: "40px" }}>
                <div style={{ flex: 1 }}>
                  <div className="mb-3">
                    <label htmlFor="fullName" style={{ fontWeight: "bold" }}>Full Name</label>
                    <input type="text" id="fullName" name="fullName" className="form-control" placeholder="First Last" 
                    value={editedAddress.full_name} onChange={(e) => setEditedAddress({ ...editedAddress, full_name: e.target.value})
                    } />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" style={{ fontWeight: "bold" }}>Phone Number</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="Please enter your phone number" 
                    value={editedAddress.phone_number} onChange={(e) => setEditedAddress({ ...editedAddress, phone_number: e.target.value})
                  } />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="detailedAddress" style={{ fontWeight: "bold" }}>Detailed Address</label>
                    <input type="text" id="detailedAddress" name="detailedAddress" className="form-control" placeholder="Enter your full address here..." 
                    value={editedAddress.detailed_address} onChange={(e) => setEditedAddress({ ... editedAddress , detailed_address: e.target.value})
                    } />
                  </div>
                
                </div>
                <div style={{ flex: 1 }}>
                  <div className="mb-3">
                    <label htmlFor="province" style={{ fontWeight: "bold" }}>Province</label>
                    <select id="province" name="province" className="form-control" value={editedAddress.province} onChange={handleProvinceChange}>
                      <option value="">{address.province}</option>
                      {provinces.map((p) => <option key={p.code} value={[p.code,p.name]} >{p.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="district" style={{ fontWeight: "bold" }}>District</label>
                    <select id="district" name="district" className="form-control" value={editedAddress.district} onChange={handleDistrictChange}>
                      <option value="">Please choose your district</option>
                      {districts.map((d) => <option key={d.code} value={[d.code,d.name]} >{d.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ward" style={{ fontWeight: "bold" }}>Ward</label>
                    <select id="ward" name="ward" className="form-control" value={editedAddress.ward} onChange={handleChange}>
                      <option value="">Please choose your ward</option>
                      {wards.map((w) => <option key={w.code} value={[w.code,w.name]} >{w.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <button className="btn btn-light me-3" style={{ width: "100px", backgroundColor: "#f2f2f2" }} onClick={handleCancelClick}>Cancel</button>
                <button className="btn btn-primary" style={{ width: "100px", backgroundColor: "#ff7a00", color: "#fff" }} onClick={handleSaveClick}>Save</button>
              </div>
            </form>
          ) : (
            <div className="card shadow-sm p-4 mt-4">
              <table className="table table-striped mt-3">
                <thead className="bg-light">
                  <tr>
                    <th>Full Name</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th className="text-end">Action</th>
                    <th className= "delete" style={{width: "80px" , cursor: "pointer"}}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {address.map((item, index) => (
                    <tr key={index}>
                      <td>{item.full_name}</td>
                      <td>{item.detailed_address}</td>
                      <td>{item.phone_number}</td>
                      <td className="text-end">
                        <span
                          className="text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEditClick(index)}
                        >
                          Edit
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={(event) => {
                            event.stopPropagation(); // Ngăn chặn event lan sang thẻ cha
                            handleDelete(index);
                          }}
                        >
                          <MdDelete  style={{marginLeft: "13px", fontSize: "30px"}}/>
                        </span>
                      </td>

                    </tr>
                  ))}
                  {address.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">No address found</td>
                    </tr>
                  )}
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
