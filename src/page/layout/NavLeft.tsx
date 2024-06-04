import Logo from '../../assets/img/logo.jpeg';
import Card from '../../assets/img/cart.png';
import MobileNav from "./MobileNav.tsx";
import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useQuery} from 'react-query';
import DysonApi from '../../axios/DysonApi.ts';
import {useCookies} from 'react-cookie';
import {useTranslation} from "react-i18next";

export default function () {
    const [showHeaderMobile, setShowHeaderMobile] = useState(false);
    const location = useLocation();
    const {pathname} = location;
    const [cookies] = useCookies(['cart']);
    const userInfo = localStorage.getItem('userInfo');
    const jwtToken = localStorage.getItem('jwtToken');
    const {t} = useTranslation();

    const handleChangeShowHeader = () => {
        setShowHeaderMobile(!showHeaderMobile);
    }

    const {
        data: totalQuantity = 0
    } = useQuery(['myCartQuantity'], async () => {
        const res = await DysonApi.getCart(cookies.cart);
        return res.products.reduce((acc: number, cur: any) => acc + cur.quantity, 0)
    }, {
        enabled: !!cookies.cart
    })


    return (
        <>
            <MobileNav handleShowMenu={handleChangeShowHeader}/>
            <header className={!showHeaderMobile ? 'header-area clearfix' : 'header-area clearfix bp-xs-on'}>
                <div className="nav-close" onClick={handleChangeShowHeader}>
                    <i className="fa fa-close" aria-hidden="true"></i>
                </div>
                <div className="logo">
                    <Link to="/"><img src={Logo} alt=""/></Link>
                </div>
                <nav className="amado-nav">
                    <ul>
                        <li className={pathname === '/' ? 'active' : ''}>
                            <Link to={'/'}>{t("Trang chủ")}
                            </Link>
                        </li>
                        <li className={pathname === '/shop' ? 'active' : ''}>
                            <Link to={'/shop'}>
                                {t("Sản phẩm")}
                            </Link>
                        </li>

                        <li className={pathname === '/tracking-order' ? 'active' : ''}>
                            <Link to={'/tracking-order'}>
                                {t("Kiểm tra đơn hàng")}
                            </Link>
                        </li>
                        {
                            userInfo && jwtToken && (
                                <li><Link to={'/admin'}>Admin</Link></li>
                            )
                        }
                    </ul>
                </nav>
                <div className="cart-fav-search mb-100">
                    <Link to={'/cart'} className="cart-nav">
                        <img src={Card} alt=""/>
                        {t("Giỏ hàng")}
                        <span>
                            {` (${totalQuantity})`}
                        </span>
                    </Link>
                </div>
                <div className="social-info d-flex justify-content-between">
                    <a href="tel:0386671690" target={"_blank"}>
                        <i className="fa fa-phone" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.instagram.com/elysium.candles__/" target={"_blank"}>
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61557619921037" target={"_blank"}>
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                    <a href="mailto:elysium.infor@gmail.com" target={"_blank"}>
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                    </a>
                </div>
            </header>
        </>
    )
}
