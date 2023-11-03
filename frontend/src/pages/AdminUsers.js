import { useContext } from 'react';
import { CartContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const navigate = useNavigate();
    const { users, setAdminuser } = useContext(CartContext);

    const handleClick = (element) => {
        // console.log(element);
        setAdminuser(element);
        navigate("/adminusers/profile");
    }

    return (
        <div>
            <div className="users-cnt">
                {
                    users.map((element, index) => {
                        return (
                            <div key={index} className='userItem' onClick={() => { handleClick(element) }}>
                                <span>Name : {element.name}</span> <br />
                                <span>Alias : {element.alias}</span>
                            </div>
                        )
                    })
                }

            </div>
            <footer>
                © 2022 THE GREEN BRIDGE Ingenieurgesellschaft mbH
            </footer>
        </div>
    )
}

export default AdminUsers