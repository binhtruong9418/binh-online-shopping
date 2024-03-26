import Footer from './Footer'
import NavLeft from './NavLeft'
import {ConfigProvider} from "antd";
import viVN from 'antd/lib/locale/vi_VN';
const DefaultLayout = ({ children }: any) => {
    return (
        <ConfigProvider locale={viVN}>
            <div className={"main-content-wrapper d-flex clearfix"} style={{ minHeight: '100vh' }}>
                <NavLeft />
                {children}
            </div>
            <Footer />
        </ConfigProvider>
    )
}

export default DefaultLayout