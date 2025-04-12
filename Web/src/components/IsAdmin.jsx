import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IsAdmin = ({ children }) => {
    const navigate = useNavigate();
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")).data : null;

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.role !== 1) {
            alert("Không có quyền truy cập");
            navigate("/");
        }
    }, [user, navigate]);

    if (!user) return null; 

    return children;
};

export default IsAdmin;
