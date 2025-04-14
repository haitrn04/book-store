import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUber,
  FaShoppingCart,
  FaBox,
  FaList,
  FaChartBar,
  FaSignOutAlt,
  FaHome,
  FaClock,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { HeaderAdmin } from "../../components";
import {
  getTotalOrders,
  getCountUser,
  getTotalSales,
  getRecentTransactions,
  getPendingOrders,
} from "../../services/apiService";

const Sidebar = () => (
  <div
    className="d-flex flex-column p-3 bg-white shadow position-fixed"
    style={{ width: "250px", height: "100vh" }}
  >
    <h4 className="text-primary text-center">Seller Page</h4>
    <ul className="nav flex-column mt-3">
      <li className="nav-item">
        <Link
          to="/dashboard"
          className="nav-link text-white fw-bold bg-primary p-2 rounded"
        >
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
        <Link to="/customer" className="nav-link text-dark">
          <FaUber className="me-2" /> Customer
        </Link>
      </li>
    </ul>
    <hr />
    <Link to="/" className="nav-link text-danger">
      <FaHome className="me-2" /> Back to Home
    </Link>
    <Link to="/login" className="nav-link text-danger">
      <FaSignOutAlt className="me-2" /> Logout
    </Link>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    sales: 0,
    pending: 0,
  });
  const [transactionsData, setTransactionsData] = useState([]);
  const [transactionChartData, setTransactionChartData] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dateFilter, setDateFilter] = useState("allDates");

  useEffect(() => {
    fetchDashboardData();
    fetchRecentTransactions();
  }, []);

  useEffect(() => {
    filterTransactionsByDate();
  }, [dateFilter, transactionsData]);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes, salesRes, pendingRes] = await Promise.all([
        getTotalOrders(),
        getCountUser(),
        getTotalSales(),
        getPendingOrders(),
      ]);
      setStats({
        users: usersRes?.data?.total_user || 0,
        orders: ordersRes?.data?.total || 0,
        sales: salesRes?.data?.total_sales || 0,
        pending: pendingRes?.data?.total_pending_orders || 0,
      });
    } catch (error) {
      console.error("Loi:", error);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await getRecentTransactions();
      const transactions = response.data || [];
      setTransactionsData(transactions);
    } catch (error) {
      console.error("loi: ", error);
    }
  };

  const filterTransactionsByDate = () => {
    if (!transactionsData || transactionsData.length === 0) return;

    let startDate = new Date();
    let endDate = new Date();

    switch (dateFilter) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "3days":
        startDate.setDate(startDate.getDate() - 2);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7days":
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "thisMonth":
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        break;
      case "lastMonth":
        startDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() - 1,
          1
        );
        endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0
        );
        break;
      case "allDates":
      default:
        setFilteredTransactions(transactionsData);
        setTransactionChartData(
          transactionsData.map((item) => ({
            name: item.product,
            price: parseFloat(item.amount),
            date: item.date,
          }))
        );
        return;
    }

    const filtered = transactionsData.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    setFilteredTransactions(filtered);
    setTransactionChartData(
      filtered.map((item) => ({
        name: item.product,
        price: parseFloat(item.amount),
        date: item.date,
      }))
    );
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <HeaderAdmin />
        <div className="container my-4">
          <h2>Dashboard</h2>
          <br />

          <div className="row text-center">
            {[
              {
                icon: <FaUsers className="text-primary" size={24} />,
                label: "Total Users",
                value: stats.users,
              },
              {
                icon: <FaShoppingCart className="text-warning" size={24} />,
                label: "Total Orders",
                value: stats.orders,
              },
              {
                icon: <span className="text-success fs-4 fw-bold">₫</span>,
                label: "Total Sales",
                value: `${Number(stats.sales.toFixed(0)).toLocaleString()} đ`,
              },
              {
                icon: <FaClock className="text-danger" size={24} />,
                label: "Pending Orders",
                value: stats.pending,
              },
            ].map((stat, i) => (
              <div key={i} className="col-md-3 mb-3">
                <div className="card shadow-sm p-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">{stat.icon}</div>
                    <div>
                      <h5 className="mb-0 fw-bold">{stat.value}</h5>
                      <small>{stat.label}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <select
              className="form-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="3days">Last 3 Days</option>
              <option value="7days">Last 7 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="allDates">All Dates</option>
            </select>
          </div>

          <div className="card shadow-sm p-4 mt-4">
            <h4>Sales Details</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={transactionChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="date"
                  tickFormatter={(label) => `${label}`}
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  dataKey="price"
                  tickFormatter={(value) => `${value.toLocaleString()} đ`}
                  tick={{ fontSize: 9 }}
                />
                <Tooltip
                  formatter={(value) => `${Number(value).toLocaleString()} đ`}
                  labelFormatter={(label) => `Ngày: ${label}`}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { name, price } = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <p>{`Sản phẩm: ${name}`}</p>
                          <p>{`Giá: ${price.toLocaleString()} đ`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line dataKey="price" stroke="#3399ff" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card shadow-sm p-4 mt-4">
            <h4>Recent Transactions</h4>
            <table className="table table-striped mt-3">
              <thead className="bg-light">
                <tr>
                  <th>Product</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, i) => (
                  <tr key={i}>
                    <td>{t.product}</td>
                    <td>{t.location}</td>
                    <td>{t.date}</td>
                    <td>{t.quantity}</td>
                    <td>{Number(t.amount).toLocaleString()} đ</td>
                    <td>
                      <span
                        className={`badge ${
                          t.status === "paid"
                            ? "bg-success"
                            : t.status === "failed"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
