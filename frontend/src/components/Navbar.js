import { useContext } from 'react';
import { CartContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();
    const { setAuth, auth } = useContext(CartContext);

    const handleLogout = () => {
        localStorage.removeItem("smtoken");
        setAuth(null);
        navigate("/login");
    }
    const handleProfile = () => {
        navigate("/profile");
    }
    const handleHome = () => {
        navigate("/");
    }
    return (
        <div className="nav">
            <input type="checkbox" id="nav-check" />
            <div className="nav-header">
                <div className="nav-title">
                    Smart Snapper
                </div>
            </div>
            <div className="nav-btn">
                <label htmlFor="nav-check">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>

            <div className="nav-links">
                <a onClick={handleHome} style={{ cursor: "pointer" }}>Home</a>
                <a onClick={handleProfile} style={{ cursor: "pointer" }}>Profile</a>
                <a onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</a>
            </div>
        </div>
    )
}

export default Navbar