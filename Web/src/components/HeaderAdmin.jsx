import React from "react";

import { FaBars} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import avt from '../assets/images/avt_default.jpg';
import 'react-toastify/dist/ReactToastify.css';


const HeaderAdmin = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))?.data;
    return (
        <div className="d-flex justify-content-between align-items-center p-3 shadow-sm bg-white position-fixed"
            style={{ top: "0", left: "250px", right: "0", height: "60px", zIndex: "1000", width: "calc(100% - 250px)" }}>
            <p></p>
            <div className="d-flex align-items-center">
                {
                    user.image_data ? (
                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                        <img src={`data:image/jpeg;base64,${user.image_data}`} alt="User Image" className="avt rounded-circle" style={{ width: '35px', height: '35px' }} />
                    ) : (
                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                        <img src={avt} alt="User Image" className="avt rounded-circle" style={{ width: '35px', height: '35px' }} />
                    )
                }
                <div className="text-end ms-2">
                    <span className="text-muted">{user.full_name}</span>
                </div>
            </div>
            <p></p>
        </div>
    );
};

export default HeaderAdmin;