import { useContext, useState } from 'react';
import { CartContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';

import { getProfile } from '../http';

const UserProfile = () => {
    const navigate = useNavigate();
    const { baseURL, adminuser, setAdminuser } = useContext(CartContext);

    const [upload, setUpload] = useState(null);

    const [name, setName] = useState(adminuser.name);
    const [email, setEmail] = useState(adminuser.email);

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = btoa(e.target.result);
                const newb = "data:image/jpeg;base64," + base64String;
                // console.log(newb);
                setUpload(newb);
            };
            reader.readAsBinaryString(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = adminuser.token;
            if (upload !== null) {
                await fetch(`${baseURL}/updateavatar`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        avatar: upload,
                        alias: adminuser.alias
                    })
                });
                setUpload(null);
            }
            if (name !== adminuser.name || email !== adminuser.email) {
                await fetch(`${baseURL}/update`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        token, email, name
                    })
                })
            }
            if (token !== null) {
                const { data } = await getProfile({ token });
                // console.log(data.allAlias[0]);
                setAdminuser(data.allAlias[0]);
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <div className="profile-cnt">
                <div className="img-div">
                    <img src={!(adminuser.avatar === null) ? `${baseURL}/${adminuser.avatar}` : "/images/pf.jpg"} alt="profile" />
                    <input type="file" className="file" onChange={(e) => { handleChange(e) }} />
                </div>
                <div className="data-div">
                    <span>Name : {adminuser.name}</span>
                </div>
                <div className="data-div">
                    <span>Email : {adminuser.email}</span>
                </div>
                <div className="data-div">
                    <span>Alias : {adminuser.alias}</span>
                </div>
                <div className="data-div">
                    <span>Companyname : {adminuser.companyname}</span>
                </div>
                <div className="data-div">
                    <label htmlFor="modal" className="example-label">Update</label>
                </div>
                <input type="checkbox" id="modal" />
                <label htmlFor="modal" className="modal-background"></label>

                <div className="modal">
                    <div className="modal-header">
                        <h3>Update Profile</h3>
                        <label htmlFor="modal">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAABNTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU0N3NIOAAAAJnRSTlMAAQIDBAUGBwgRFRYZGiEjQ3l7hYaqtLm8vsDFx87a4uvv8fP1+bbY9ZEAAAB8SURBVBhXXY5LFoJAAMOCIP4VBRXEv5j7H9HFDOizu2TRFljedgCQHeocWHVaAWStXnKyl2oVWI+kd1XLvFV1D7Ng3qrWKYMZ+MdEhk3gbhw59KvlH0eTnf2mgiRwvQ7NW6aqNmncukKhnvo/zzlQ2PR/HgsAJkncH6XwAcr0FUY5BVeFAAAAAElFTkSuQmCC" width="16" height="16" alt="" />
                        </label>
                    </div>
                    <div className='modal-content'>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label> <br />
                                <input type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value) }}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label> <br />
                                <input type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <button type='submit'>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <footer>
                © 2022 THE GREEN BRIDGE Ingenieurgesellschaft mbH
            </footer>
        </div>
    )
}

export default UserProfile