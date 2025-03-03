import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { postRegister } from '../services/apiService';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBithday] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email || !password || !fullName || mobile || gender || birthday) {
            setError("Các thông tin không được để trống!");
            setLoading(false);
            return;
        }

        try {
            await postRegister(fullName, email, password, mobile, gender, birthday);
            alert("Register successfully")
            navigate(`/login`);
        } catch (err) {
            setError("Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        sessionStorage.setItem("user", JSON.stringify(''));
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [error]);
    return (
        <>

            {error &&
                <div className="alert alert-danger fixed-bottom right-0 m-3" style={{ width: 'fit-content' }}>
                    {error}
                </div>
            }

            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div class="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div class="form my-3">
                                <label htmlFor="Name">Full Name</label>
                                <input
                                    type="text"
                                    class="form-control"
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
                                    type="number"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder=""
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.trim())}
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="floatingInput">Gender</label>
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
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button
                                    className="my-2 mx-auto btn btn-dark"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register