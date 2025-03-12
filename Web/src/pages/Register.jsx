import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { postRegister } from '../services/apiService';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [gender, setGender] = useState("Female"); // Set default value
    const [birthday, setBithday] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!email || !password || !fullName || !mobile || !gender || !birthday) {
            toast.error("All fields are required!");
            setLoading(false);
            return;
        }

        try {
            await postRegister(fullName, email, password, mobile, gender, birthday);
            toast.success("Registration successful!");
            navigate(`/login`);
        } catch (err) {
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        sessionStorage.setItem("user", JSON.stringify(''));
    }, []);

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="form my-3">
                                <label htmlFor="Name">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Name"
                                    placeholder="Enter Your Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value.trim())}
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="floatingInput">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.trim())}
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="floatingPassword">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value.trim())}
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="floatingInput">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder=""
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.trim())}
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="floatingInput">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="form-control"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="my-3">
                            <label htmlFor="floatingInput">Birthday</label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                className="form-control"
                                value={birthday}
                                onChange={(e) => setBithday(e.target.value)}
                            />
                            </div>
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button
                                    className="my-2 mx-auto btn btn-dark"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default Register;