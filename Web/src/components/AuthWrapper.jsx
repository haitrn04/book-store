import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"))?.data;

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return user ? children : null;
};

export default AuthWrapper;
