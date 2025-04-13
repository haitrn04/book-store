import React, { useState, useEffect } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import avt from '../assets/images/avt_default.jpg';
import { FaSearch, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaStore, FaUser } from "react-icons/fa";
import { findProduct } from '../services/apiService';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ user }) => {
    const cartItems = useSelector(state => state.handleCart);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const controller = new AbortController(); // Tạo controller để hủy request
        const signal = controller.signal;
    
        const fetchData = async () => {
            const trimmedSearchTerm = searchTerm.trim().toLowerCase();
            if (!trimmedSearchTerm) {
                setData([]);
                setShowResults(false);
                return;
            }
    
            try {
                const response = await findProduct(trimmedSearchTerm, { signal });
                const filteredData = response.data.filter(item =>
                    item.book_name.toLowerCase().includes(trimmedSearchTerm) ||
                    item.author.toLowerCase().includes(trimmedSearchTerm)
                );
    
                setData(filteredData);
                setShowResults(filteredData.length > 0);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
                }
            }
        };
    
        const debounce = setTimeout(fetchData, 100); // Chờ 300ms trước khi gọi API
    
        return () => {
            clearTimeout(debounce); // Hủy timeout trước đó nếu `searchTerm` thay đổi
            controller.abort(); // Hủy request API nếu có request cũ
        };
    }, [searchTerm]);
    
    

    // Hàm làm nổi bật từ khóa tìm kiếm
    const highlightMatch = (text) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        return text.replace(regex, `<span class="text-primary">$1</span>`);
    };
    


    useEffect(() => {
        const handleClickOutside = () => setShowResults(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSearchContainerClick = (e) => {
        e.stopPropagation();
        setShowResults(true);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4" to="/">
                    <span className="text-primary">B</span>ookStore
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    {user && (
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link fw-semibold" activeClassName="active" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link fw-semibold" activeClassName="active" to="/product">Books</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link fw-semibold" activeClassName="active" to="/about">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link fw-semibold" activeClassName="active" to="/contact">Contact</NavLink>
                            </li>
                        </ul>
                    )}

                    {user && (
                        <div className="d-flex position-relative mx-auto" style={{ maxWidth: '500px' }} onClick={handleSearchContainerClick}>
                            <div className="position-relative w-100">
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Search"
                                    style={{
                                        borderRadius: '20px',
                                        paddingLeft: '40px',
                                        width: '400px',
                                        height: '42px'
                                    }}
                                />
                                <div className="position-absolute" style={{
                                    top: '50%',
                                    left: '15px',
                                    transform: 'translateY(-50%)'
                                }}>
                                    <FaSearch className="text-muted" />
                                </div>
                            </div>

                            {showResults && searchTerm && data.length > 0 && (
                                <div
                                    className="position-absolute top-100 start-0 mt-1 w-100 bg-white border rounded shadow-sm custom-scrollbar"
                                    style={{ zIndex: 1000, maxHeight: '500px', overflowY: 'auto' }}
                                >
                                    <div className="list-group list-group-flush">
                                        {data
                                        .filter(product => product.is_active) 
                                        .map(item => (
                                            <Link
                                                key={item.id_book}
                                                to={`/product/${item.id_book}`}
                                                className="list-group-item list-group-item-action py-2"
                                                onClick={() => setShowResults(false)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={`data:image/jpeg;base64,${item.image_data}`}
                                                        alt={item.book_name}
                                                        className="img-thumbnail me-3"
                                                        style={{ width: "50px", height: "70px", objectFit: "cover" }}
                                                    />
                                                    <div>
                                                        {/* Hiển thị tên sách với từ khóa được làm nổi bật */}
                                                        <div className="fw-bold text-truncate" style={{ maxWidth: "250px" }}
                                                            dangerouslySetInnerHTML={{ __html: highlightMatch(item.book_name) }} />

                                                        <div className="text-primary">
                                                            {parseInt((parseInt(item.price) * (100 - parseInt(item.discount)) / 100)).toLocaleString("vi-VN")}<sup>₫</sup>
                                                            {parseInt(item.discount) > 0 && (
                                                                <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: "0.8rem" }}>
                                                                    {parseInt(item.price).toLocaleString("vi-VN")}<sup>₫</sup>
                                                                </span>
                                                            )}
                                                            <span className="text-muted ms-2" style={{ fontSize: "0.8rem" }}
                                                                dangerouslySetInnerHTML={{ __html: highlightMatch(item.author) }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                </div>
                            )}
                        </div>
                    )}

                    <div className="d-flex align-items-center ms-auto gap-2" id="navbarAccount">
                        {user && user.id_account > 0 ? (
                            <>
                                <NavLink to="/cart" className="btn btn-outline-primary position-relative me-2">
                                    <FaShoppingCart className="me-2" />
                                    <span className="d-none d-md-inline fw-bold">My Cart</span>
                                    {cartItems.length > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-warning text-dark">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </NavLink>

                                <div className="dropdown dropdown-hover">
                                    <button
                                        className="btn btn-outline-light d-flex align-items-center border-0"
                                        type="button"
                                        aria-expanded="false"
                                    >
                                        <div className="me-2">
                                            {user.image_data ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${user.image_data}`}
                                                    alt="User"
                                                    className="rounded-circle border"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <img
                                                    src={avt}
                                                    alt="User"
                                                    className="rounded-circle border"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                />
                                            )}
                                        </div>
                                        <span className="fw-bold text-dark d-none d-md-block">{user.full_name}</span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <NavLink className="dropdown-item" to="/ManageMyAccount">
                                                <FaUser className="me-2" /> My Profile
                                            </NavLink>
                                        </li>
                                        {user.role == 1 && (
                                            <li>
                                                <NavLink className="dropdown-item" to="/dashboard">
                                                    <FaStore className="me-2" /> Seller Dashboard
                                                </NavLink>
                                            </li>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <NavLink className="dropdown-item text-danger" to="/login">
                                                <FaSignOutAlt className="me-2" /> Logout
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="btn btn-outline-primary">
                                    <FaSignInAlt className="me-1" /> Login
                                </NavLink>
                                <NavLink to="/register" className="btn btn-primary">
                                    <FaUserPlus className="me-1" /> Register
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dropdown-hover:hover .dropdown-menu {
                    display: block;
                    margin-top: 0;
                }

                .dropdown-hover .dropdown-menu {
                    display: none;
                }

                .dropdown-menu {
                    transition: all 0.2s ease-in-out;
                }

                .dropdown-hover {
                    position: relative;
                }

                @media (max-width: 991px) {
                    .navbar-collapse.show .navbar-nav {
                        flex-direction: row;
                        justify-content: space-around;
                        width: 100%;
                    }
                    
                    .navbar-collapse.show .nav-item {
                        margin: 0 10px;
                    }

                    #navbarAccount {
                        align-items: center;
                        justify-content: center;
                    }
                }
                /* Tùy chỉnh thanh cuộn trên WebKit (Chrome, Safari) */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px; /* Độ rộng thanh cuộn */
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1; /* Màu nền track */
                    border-radius: 5px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888; /* Màu thanh cuộn */
                    border-radius: 5px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555; /* Màu khi hover */
                }

            `}</style>
        </nav>
    );
}

export default Navbar;