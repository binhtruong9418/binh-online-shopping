import Logo from '../../assets/img/logo.png';
import Card from '../../assets/img/cart.png';
import MobileNav from "./MobileNav.tsx";
import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useQuery} from 'react-query';
import DysonApi from '../../axios/DysonApi.tsx';
import {useCookies} from 'react-cookie';

export default function () {
    const [showHeaderMobile, setShowHeaderMobile] = useState(false);
    const location = useLocation();
    const {pathname} = location;
    const [cookies] = useCookies(['cart']);
    const userInfo = localStorage.getItem('userInfo');
    const jwtToken = localStorage.getItem('jwtToken');

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
                    <a href="#"><img src={Logo} alt=""/></a>
                </div>
                <nav className="amado-nav">
                    <ul>
                        <li className={pathname === '/' ? 'active' : ''}><Link to={'/'}>Home</Link></li>
                        <li className={pathname === '/shop' ? 'active' : ''}><Link to={'/shop'}>Shop</Link></li>
                        {
                            userInfo && jwtToken && (
                                <li><Link to={'/admin'}>Admin</Link></li>
                            )
                        }
                    </ul>
                </nav>
                <div className="cart-fav-search mb-100">
                    <Link to={'/cart'} className="cart-nav"><img src={Card}
                                                                 alt=""/> Cart <span>{`(${totalQuantity})`}</span></Link>
                </div>
                <div className="social-info d-flex justify-content-between">
                    <a href="https://github.com/binhtruong9418" target={"_blank"}>
                        <i className="fa fa-github" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/binh-duc-731682170/" target={"_blank"}>
                        <i className="fa fa-linkedin" aria-hidden="true"></i>
                    </a>
                    <a href="https://facebook.com/ducbinh9418" target={"_blank"}>
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                    <a href="https://twitter.com/DucBinh9418" target={"_blank"}>
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                </div>
            </header>
        </>
    )
}
