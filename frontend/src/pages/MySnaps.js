import Sidebar from "../components/Data/Sidebar"

const MySnaps = () => {
    return (
        <div>
            <div className="container">
                <Sidebar />
                <div className="main-sec" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", overflowY: "scroll" }}>
                    <img src="/images/logo2.png" alt="logo" className='logo' style={{ width: "200px", height: "200px" }} />
                </div>
            </div>
            <footer>
                © 2022 THE GREEN BRIDGE Ingenieurgesellschaft mbH
            </footer>
        </div>
    )
}

export default MySnaps