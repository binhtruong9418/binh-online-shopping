import Logo from '../../assets/img/logo.png';
import PropTypes, {InferProps} from "prop-types";
export default function MobileNav ({handleShowMenu}: InferProps<typeof MobileNav.propTypes>) {
    return (
        <div className="mobile-nav">
            <div className="amado-navbar-brand">
                <a href="#"><img src={Logo} alt="" width={60} height={60}/></a>
            </div>
            <div className="amado-navbar-toggler" onClick={handleShowMenu}>
                <span/><span/><span/>
            </div>
        </div>
    )
}
MobileNav.propTypes = {
    handleShowMenu: PropTypes.func.isRequired
}

