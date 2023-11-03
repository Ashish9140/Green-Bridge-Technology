import React, { useState, useContext } from 'react'
import { signUpUser } from '../http'
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import Loader from './Loader';

const Register = () => {
    const navigate = useNavigate();

    const [alias, setAlias] = useState('');
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [load, setLoad] = useState(false);
    const { setAuth } = useContext(CartContext);

    async function handleSignUp(e) {
        setLoad(true);
        e.preventDefault();
        try {
            const { data } = await signUpUser({ email, name, password, alias, companyname: company, avatar: null });
            localStorage.setItem("smtoken", JSON.stringify(data.token));
            setAuth(data);
            setLoad(false);
            navigate("/");
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
        navigate("/login");
    }
    return (
        load ?
            <Loader />
            :
            <div className="auth">
                <div className="center">
                    <h1>Register</h1>
                    <form onSubmit={handleSignUp}>
                        <div className="txt_field">
                            <input type="text" autoComplete='new-password'
                                value={alias}
                                onChange={(e) => { setAlias(e.target.value) }}
                                required />
                            <label>Alias</label>
                        </div>
                        <div className="txt_field">
                            <input type="text" autoComplete='new-password'
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                                required />
                            <label>Name</label>
                        </div>
                        <div className="txt_field">
                            <input type="text" autoComplete='new-password'
                                value={company}
                                onChange={(e) => { setCompany(e.target.value) }}
                                required />
                            <label>Company Name</label>
                        </div>
                        <div className="txt_field">
                            <input type="email" autoComplete='new-password'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                required />
                            <label>Email</label>
                        </div>
                        <div className="txt_field">
                            <input type="password" autoComplete='new-password'
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                required />
                            <label>Password</label>
                        </div>
                        <input name="submit" type="Submit" autoComplete='new-password' value="Sign Up" />
                        <div className="signup_link">
                            Have an Account ? <a onClick={handleClick}>Login Here</a>
                        </div>
                    </form>
                    {error && <div style={{ textAlign: "center" }}>{error}</div>}
                </div>
            </div>
    )
}

export default Register