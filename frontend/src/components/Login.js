import { useNavigate } from 'react-router-dom';
import { loginUser } from '../http'
import { CartContext } from '../CartContext';
import { useState, useContext } from 'react';
import Loader from './Loader'

const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [load, setLoad] = useState(false);
    const { setAuth } = useContext(CartContext);

    const handleLogin = async (e) => {
        setLoad(true);
        e.preventDefault();
        try {
            const { data } = await loginUser({ alias: username, password });
            localStorage.setItem("smtoken", JSON.stringify(data.token));
            setAuth(data);
            setLoad(false);
            navigate("/");
            // console.log(data);
        } catch (error) {
            if (error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500) {
                setError(error.response.data.message);
                setLoad(false);
            }
        }
    }

    const handleClick = () => {
        navigate("/register");
    }

    return (
        load ?
            <Loader />
            :
            <div className="auth">
                <div className="center" >
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="txt_field">
                            <input type="text" autoComplete='new-password'
                                value={username} onChange={(e) => { setUsername(e.target.value) }}
                                required />
                            <label>Username</label>
                        </div>
                        <div className="txt_field">
                            <input type="password" autoComplete='new-password'
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                required />
                            <label>Password</label>
                        </div>
                        <input name="submit" type="Submit" value="Sign In" />
                        <div className="signup_link">
                            Don't have an account ? <a onClick={handleClick}>Register Here</a>
                        </div>
                    </form>
                    {error && <div style={{ textAlign: "center" }}>{error}</div>}
                </div>
            </div>
    )
}

export default Login