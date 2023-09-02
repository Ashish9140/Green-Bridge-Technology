import { useNavigate, Link } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const handleClick = (e) => {
        let rt = (e.target.innerHTML).toLowerCase();
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