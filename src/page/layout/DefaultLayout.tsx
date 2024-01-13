import Footer from './Footer'
import NavLeft from './NavLeft'

const DefaultLayout = ({ children }: any) => {
    return (
        <>
            <div className={"main-content-wrapper d-flex clearfix"} style={{ minHeight: '100vh' }}>
                <NavLeft />
                {children}
            </div>
            <Footer />
        </>
    )
}

export default DefaultLayout