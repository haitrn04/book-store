import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FaUsers,
  FaBox,
  FaUber,
  FaList,
  FaHome,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";
import { HeaderAdmin, Loading } from "../../components";
import { getAccounts, getOrders } from "../../services/apiService";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 bg-white shadow position-fixed"
      style={{ width: "250px", height: "100vh", top: "0", left: "0" }}
    >
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
          <Link
            to="/customer"
            className="nav-link text-white fw-bold bg-primary p-2 rounded"
          >
            <FaUber className="me-2" /> Customer
          </Link>
        </li>
      </ul>
      <hr />
      <Link to="/" className="nav-link text-danger">
        <FaHome className="me-2" /> Back to Home
      </Link>
      <Link to="/login" className="nav-link text-danger">
        <FaSignOutAlt className="me-2" />
        Logout
      </Link>
    </div>
  );
};

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedAccountId, setExpandedAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Sửa: Khởi tạo true để loading ngay

  const calculateFinalPrice = (price, discount) =>
    price - (price * discount) / 100;

  // Lấy danh sách khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getAccounts();
        res.data.sort((a, b) => a.id_account - b.id_account);
        setCustomers(res.data || []);
        setFilteredCustomers(res.data || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Lọc đơn hàng theo id_account và lưu theo từng khách hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true); // Bật loading khi bắt đầu fetch
        const res = await getOrders();
        const allOrders = res.data || [];

        const ordersByAccount = {};
        allOrders.forEach((order) => {
          const accountId = order.id_account;
          if (!ordersByAccount[accountId]) {
            ordersByAccount[accountId] = [];
          }
          ordersByAccount[accountId].push(...(order.order_details || []));
        });

        setOrderDetails(ordersByAccount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false); // Tắt loading sau khi fetch xong
      }
    };

    fetchOrders();
  }, []);

  // Lọc khách hàng theo từ khóa
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const customerName = customer.full_name || "";
      const keyword = searchKeyword || "";
      return customerName.toLowerCase().includes(keyword.toLowerCase());
    });
    setFilteredCustomers(filtered);
  }, [searchKeyword, customers]);

  // Toggle hiển thị đơn hàng
  const totalOrderDetails = (id_account) => {
    setExpandedAccountId(expandedAccountId === id_account ? null : id_account);
  };

  return (
    <div
      className="container-fluid mt-5 py-4"
      style={{ background: "#f4f7fa" }}
    >
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="p-4">
          <h2 className="fw-bold mb-4" style={{ color: "#1a3c61" }}>
            Customer Management
          </h2>
          <div className="d-flex align-items-center gap-3 p-3 bg-white rounded shadow-sm mb-4 flex-wrap">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Order Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <React.Fragment key={customer.id_account}>
                      <tr className="align-middle">
                        <td className="p-3">{customer.id_account}</td>
                        <td className="p-3">{customer.full_name}</td>
                        <td className="p-3">{customer.phone_num}</td>
                        <td className="p-3">{customer.email}</td>
                        <td className="p-3">
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              totalOrderDetails(customer.id_account)
                            }
                          >
                            {expandedAccountId === customer.id_account
                              ? "Hide Orders"
                              : "View Orders"}
                          </button>
                        </td>
                      </tr>
                      {expandedAccountId === customer.id_account && (
                        <tr>
                          <td colSpan="8" className="p-0">
                            <div className="bg-light p-4 mx-2 mb-3 rounded shadow-sm">
                              <h5
                                className="fw-bold mb-3"
                                style={{ color: "#1a3c61" }}
                              >
                                Total order
                              </h5>
                              <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                  <thead className="bg-primary text-white">
                                    <tr>
                                      <th>No.</th>
                                      <th>Image</th>
                                      <th>Book</th>
                                      <th>Author</th>
                                      <th>Price</th>
                                      <th>Discount</th>
                                      <th>Final Price</th>
                                      <th>Quantity</th>
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {isLoading ? (
                                      <tr style={{ position: "relative" }}>
                                        <td
                                          colSpan="8"
                                          className="text-center py-4 text-muted"
                                        >
                                          <Loading isLoading={isLoading} />
                                        </td>
                                      </tr>
                                    ) : orderDetails[customer.id_account]
                                        ?.length > 0 ? (
                                      orderDetails[customer.id_account].map(
                                        (item, index) => {
                                          const finalPrice =
                                            calculateFinalPrice(
                                              item.price,
                                              item.discount
                                            );
                                          const itemTotal =
                                            finalPrice * item.quantity;
                                          return (
                                            <tr key={index}>
                                              <td className="text-center">
                                                {index + 1}
                                              </td>
                                              <td className="text-center">
                                                <img
                                                  src={`data:image/jpeg;base64,${item.image_data}`}
                                                  alt={item.book_name}
                                                  className="img-thumbnail"
                                                  style={{
                                                    width: "50px",
                                                    height: "70px",
                                                    objectFit: "cover",
                                                  }}
                                                />
                                              </td>
                                              <td>{item.book_name}</td>
                                              <td>{item.author}</td>
                                              <td>
                                                {item.price?.toLocaleString() ||
                                                  "0"}{" "}
                                                đ
                                              </td>
                                              <td>{item.discount}%</td>
                                              <td>
                                                {finalPrice?.toLocaleString() ||
                                                  "0"}{" "}
                                                đ
                                              </td>
                                              <td>{item.quantity}</td>
                                              <td>
                                                {parseInt(
                                                  itemTotal
                                                )?.toLocaleString() || "0"}{" "}
                                                đ
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan="9"
                                          className="text-center text-muted"
                                        >
                                          No orders
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
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
