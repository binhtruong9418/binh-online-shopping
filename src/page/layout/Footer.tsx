import Logo from '../../assets/img/logo.png';
import {Link} from "react-router-dom";
export default function () {
    return (
        <footer className="footer_area clearfix">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-12 col-lg-4">
                        <div className="single_widget_area">
                            <div className="footer-logo mr-50">
                                <Link to="/"><img style={{
                                    height: "100px",
                                    width: "100px"
                                }} src={Logo} alt="" /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="single_widget_area">
                            <div className="footer_menu">
                                <nav className="navbar navbar-expand-lg justify-content-end">
                                    <div className="collapse navbar-collapse" id="footerNavContent">
                                        <ul className="navbar-nav ml-auto">
                                            <li className="nav-item active">
                                                <Link className="nav-link" to="/">Trang chủ</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/shop">Sản phẩm</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/cart">Giỏ hàng</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/checkout">Thanh toán</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
