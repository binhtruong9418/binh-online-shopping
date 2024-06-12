import Logo from '../../assets/img/logo.png';
import Card from '../../assets/img/cart.png';
import MobileNav from "./MobileNav.tsx";
import {useMemo, useState} from "react";
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
    } = useQuery(['myCartQuantity', cookies], async ({queryKey}: any) => {
        const [, cartData] = queryKey;
        const res = await DysonApi.getCart(cartData.cart);
        return res.products.reduce((acc: number, cur: any) => acc + cur.quantity, 0)
    }, {
        enabled: !!cookies.cart
    })

    const {path, label} = useMemo(() => {
        if (userInfo && jwtToken) {
            const userData = JSON.parse(userInfo);
            console.log(userData)
            if (!userData.role.includes('admin')) {
                return {path: '/user/login', label: 'Đăng xuất'}
            } else {
                return {path: '/admin', label: 'Admin'}
            }
        } else {
            return {path: '/user/login', label: 'Đăng nhập'}
        }
    }, [userInfo, jwtToken])

    const handleClick = () => {
        if (label === 'Đăng xuất') {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('jwtToken');
        }
    }


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
                            <Link to={'/'}>{t("Danh sách sản phẩm")}
                            </Link>
                        </li>
                        <li className={pathname === '/shop' ? 'active' : ''}>
                            <Link to={'/shop'}>
                                {t("Tìm kiếm sản phẩm")}
                            </Link>
                        </li>

                        <li className={pathname === '/tracking-order' ? 'active' : ''}>
                            <Link to={'/tracking-order'}>
                                {t("Kiểm tra đơn hàng")}
                            </Link>
                        </li>
                        <li><Link to={path} onClick={handleClick}>{label}</Link></li>
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
                    <a href="https://github.com/binhtruong9418" target={"_blank"}>
                        <i className="fa fa-github" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/binh-duc-731682170/" target={"_blank"}>
                        <i className="fa fa-linkedin" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.facebook.com/ducbinh9418/" target={"_blank"}>
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                    <a href="mailto:binhtruong9418@gmail.com" target={"_blank"}>
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                    </a>
                </div>
            </header>
        </>
    )
}
