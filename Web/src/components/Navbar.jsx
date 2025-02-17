// import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import avt from '../assets/images/avt_default.jpg'; 


const Navbar = ({ user }) => {
    const state = useSelector(state => state.handleCart);


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
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
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center flex">
                        {
                            user ? (
                                user.image_data ? (
                                    <img src={user.image_data} alt="User Image" className="avt rounded-circle" style={{ width: '30px', height: '30px' }}  />
                                ) : (
                                    <img src={avt} alt="User Image" className="avt rounded-circle" style={{ width: '30px', height: '30px' }} />
                                )
                            ) : (
                                <></>
                            )
                        }
                        {
                            user && <span> {user.full_name} </span>
                        }
                        {user && user.id_account > 0 ? (
                            <>
                                {user.role == 1 && (
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
        </nav>
    );
}

export default Navbar;
