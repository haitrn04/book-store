import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { FaUsers, FaBox, FaUber, FaList, FaChartBar, FaSignOutAlt, FaFilter, FaHome, FaEdit, FaSave, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HeaderAdmin } from "../../components";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-white shadow position-fixed" style={{ width: "250px", height: "100vh", top: "0", left: "0" }}>
      <h4 className="text-primary text-center">Seller Page</h4>
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link text-dark">
            <FaUsers className="me-2" /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/productsad" className="nav-link text-dark">
            <FaBox className="me-2" /> Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/orderlist" className="nav-link text-dark">
            <FaList className="me-2" /> Order Lists
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/productstock" className="nav-link text-dark">
            <FaChartBar className="me-2" /> Product Stock
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/customer" className="nav-link text-white fw-bold bg-primary p-2 rounded">
            <FaUber className="me-2" /> Customer
          </Link>
        </li>
      </ul>
      <hr />
      <Link to="/" className="nav-link text-danger">
        <FaHome className="me-2" /> Back to Home
      </Link>
      <Link to="/login" className="nav-link text-danger">
        <FaSignOutAlt className="me-2" />Login
      </Link>
    </div>
  );
};

const Customer = () => {
  // State variables
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingValues, setEditingValues] = useState({ name: "", email: "", status: "" });
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const customerStatuses = ["active", "inactive", "suspended"];

  // // Lấy dữ liệu khách hàng
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       const res = await getCustomers(); // Giả lập API call
  //       setCustomers(res.data || []);
  //       setFilteredCustomers(res.data || []);
  //     } catch (error) {
  //       console.error("Error fetching customers:", error);
  //       setCustomers([]);
  //       setFilteredCustomers([]);
  //     }
  //   };
  //   fetchCustomers();
  // }, []);

  // Định dạng trạng thái badge
  const getBadgeClass = (status) => {
    const classes = {
      active: "bg-success text-white",
      inactive: "bg-warning text-dark",
      suspended: "bg-danger text-white",
    };
    return classes[status] || "bg-secondary text-white";
  };

  // Lọc khách hàng theo từ khóa và trạng thái
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const keywordMatch =
        !searchKeyword || customer.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const statusFilter =
        selectedStatus.length === 0 || selectedStatus.includes(customer.status);
      return keywordMatch && statusFilter;
    });
    setFilteredCustomers(filtered);
  }, [searchKeyword, selectedStatus, customers]);

  // Xử lý chỉnh sửa khách hàng
  const startEditing = (customer) => {
    setEditingCustomerId(customer.id);
    setEditingValues({ name: customer.name, email: customer.email, status: customer.status });
  };

  const handleFieldChange = (field, value) => {
    setEditingValues({ ...editingValues, [field]: value });
  };

  // const saveChanges = async (customerId) => {
  //   try {
  //     await updateCustomerDetails(customerId, editingValues); // Giả lập API call
  //     setCustomers((prev) =>
  //       prev.map((customer) =>
  //         customer.id === customerId ? { ...customer, ...editingValues } : customer
  //       )
  //     );
  //     setEditingCustomerId(null);
  //   } catch (error) {
  //     console.error("Error updating customer details:", error);
  //   }
  // };

  const cancelEditing = () => setEditingCustomerId(null);

  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="container-fluid mt-5 py-4" style={{ background: "#f4f7fa" }}>
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="p-4">
          <h2 className="fw-bold mb-4" style={{ color: "#1a3c61" }}>Customer Management</h2>
          <div className="d-flex align-items-center gap-3 p-3 bg-white rounded shadow-sm mb-4 flex-wrap">
            <FaFilter size={20} className="text-primary" />
            <span className="fw-medium">Filter By</span>
            <input
              type="text"
              className="form-control w-auto shadow-sm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by name"
            />
            <button
              className="btn btn-primary shadow-sm"
              onClick={() => setShowFilterBox(!showFilterBox)}
            >
              Status
            </button>
            <button
              className="btn btn-outline-danger shadow-sm"
              onClick={() => {
                setSearchKeyword("");
                setSelectedStatus([]);
              }}
            >
              Reset
            </button>
            {showFilterBox && (
              <div className="bg-white shadow p-3 rounded mt-2 position-absolute" style={{ zIndex: 1000 }}>
                <h6 className="fw-bold mb-3">Select Status</h6>
                <div className="d-flex flex-wrap gap-2">
                  {customerStatuses.map((status) => (
                    <button
                      key={status}
                      className={`btn btn-sm ${selectedStatus.includes(status) ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => toggleStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">NAME</th>
                    <th className="p-3">EMAIL</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <React.Fragment key={customer.id}>
                        <tr className="align-middle">
                          <td className="p-3">{customer.id}</td>
                          <td className="p-3">{customer.name}</td>
                          <td className="p-3">{customer.email}</td>
                          <td className="p-3">
                            {editingCustomerId === customer.id ? (
                              <select
                                className="form-select form-select-sm shadow-sm"
                                value={editingValues.status}
                                onChange={(e) => handleFieldChange("status", e.target.value)}
                              >
                                {customerStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`badge ${getBadgeClass(customer.status)} p-2`}>
                                {customer.status}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="d-flex gap-2">
                              {editingCustomerId === customer.id ? (
                                <>
                                  {/* <button
                                    className="btn btn-success btn-sm shadow-sm"
                                    onClick={() => saveChanges(customer.id)}
                                  >
                                    <FaSave /> Save
                                  </button> */}
                                  <button
                                    className="btn btn-secondary btn-sm shadow-sm"
                                    onClick={cancelEditing}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn btn-primary btn-sm shadow-sm"
                                  onClick={() => startEditing(customer)}
                                >
                                  <FaEdit /> Edit
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;

