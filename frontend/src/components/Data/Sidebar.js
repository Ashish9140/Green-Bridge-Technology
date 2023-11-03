import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../CartContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { setTargetpoint } = useContext(CartContext);
    const handleClick = (e) => {
        let rt = (e.target.innerHTML).toLowerCase();
        if (rt === "area" || rt === "line") {
            navigator.geolocation.getCurrentPosition(function (pos) {
                let lt = pos.coords.latitude;
                let ln = pos.coords.longitude;
                setTargetpoint({ latitude: lt, longitude: ln });
            })
        }
        navigate(`/mysnaps/${rt}`)
    }
    return (
        <div className="btns">
            <img src="/images/logo2.png" alt="logo" className='logo' />

            <button className="heading">Media</button>
            <button onClick={handleClick}>Photo</button>
            <button onClick={handleClick}>Audio</button>
            <button onClick={handleClick}>Video</button>
            <button onClick={handleClick}>Screenshot</button>
            <button onClick={handleClick}>Screen</button>

            <button className="heading">Geo</button>
            <button onClick={handleClick}>Line</button>
            <button onClick={handleClick}>Area</button>
        </div>
    )
}

export default Sidebar