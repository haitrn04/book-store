import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import avt from '../assets/images/avt_default.jpg';
import {
    FaSearch,
} from "react-icons/fa";

const Navbar = ({ user }) => {
    const state = useSelector(state => state.handleCart);
    
    // State để lưu thông tin tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    const [data] = useState([
        { id: 1, name: "iPhone 14 pro max 2025 ", price: "$999" , image: "https://apple.ngocnguyen.vn/cdn/images/202308/goods_img/iphone-14-pro-max-chinh-hang-G15203-1693119256387.jpg"},
        { id: 2, name: "Samsung Galaxy S23b ", price: "$899" , image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdooUd9PyYKEbovMo12PeDpEpDf2sVBLfyuQ&s"},
        { id: 3, name: "MacBook Pro", price: "$1999" , image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdooUd9PyYKEbovMo12PeDpEpDf2sVBLfyuQ&s" },
        { id: 4, name: "iPad Air  pro max 2025  pro max 2025", price: "$599", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdooUd9PyYKEbovMo12PeDpEpDf2sVBLfyuQ&s" }
    ]);

    // Lọc danh sách theo searchTerm
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        {user &&
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/product">Products</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/about">About</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link " to="/contact">Contact</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/ManageMyAccount">Profile</NavLink>
                                </li>
                                <li className="nav-item" style={{ position: "relative" }}>
                                    <div className="search" style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#d1d1d1",
                                        margin: "5px",
                                        padding: "5px",
                                        borderRadius: "5px",
                                        marginLeft : "40px"
                                    }}>
                                        <FaSearch style={{ color: "gray", marginRight: "5px" }} />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                width: "240px",
                                                height: "27px",
                                                border: "none",
                                                outline: "none",
                                                backgroundColor: "transparent",
                                                fontSize: "14px",
                                                color: "#333"
                                            }}
                                        />
                                    </div>

                                    {/* Hiển thị bảng kết quả tìm kiếm */}
                                    {searchTerm && filteredData.length > 0 && (
                                        <div style={{
                                            position: "absolute",
                                            top: "40px",
                                            left: "0",
                                            width: "400px",
                                            backgroundColor: "white",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                            zIndex: 1000
                                           
                                        }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <tbody>
                                                    {filteredData.map(item => (
                                                        <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                                                            <td style={{ padding: "8px",  width : "100px"} }>
                                                                <img src={item.image} alt={item.name} style={{ width: "40px", height: "80px", objectFit: "cover" }} />
                                                            </td>
                                                            <td style={{ padding: "8px", width: "300px" }}>
                                                                <div style={{
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    maxWidth: "280px" 
                                                                }}>
                                                                    {item.name}
                                                                </div>
                                                                <div>{item.price}</div>
                                                            </td>

                                                        </tr>
                                                        
                                                        
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </li>
                            </>
                        }
                    </ul>


                    <div className="buttons text-center flex">
                        {
                            user ? (
                                user.image_data ? (
                                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                    <img src={user.image_data} alt="User Image" className="avt rounded-circle" style={{ width: '35px', height: '35px'  }} />
                                ) : (
                                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                    <img src={avt} alt="User Image" className="avt rounded-circle" style={{ width: '35px', height: '35px'  }} />
                                )
                            ) : (
                                <></>
                            )
                        }
                        {
                            user && <span style={{fontWeight: "bold" , marginRight : "10px"}}> {user.full_name} </span>
                        }
                        {user && user.id_account > 0 ? (
                            <>
                                {user.role === "1" && (
                                    <NavLink to="/dashboard" className="btn btn-outline-dark m-1">
                                        <i className="fa fa-store mr-1"></i> Seller
                                    </NavLink>
                                )}
                                <NavLink to="/cart" className="btn btn-outline-dark m-1">
                                    <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
                                </NavLink>
                                <NavLink to="/login" className="btn btn-outline-danger m-1">
                                    <i className="fa fa-sign-out-alt mr-1"></i> Logout
                                </NavLink>
                            </>
                        ) : null}
                        {!user || user.id_account <= 0 ? (
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-1">
                                    <i className="fa fa-sign-in-alt mr-1"></i> Login
                                </NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-1">
                                    <i className="fa fa-user-plus mr-1"></i> Register
                                </NavLink>
                            </>
                        ) : null}

                    </div>
                </div>
            </div>
        </nav >
    );
}

export default Navbar;
