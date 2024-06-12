    import { Route, Routes } from "react-router-dom";
import Home from "../page/Home.tsx";
import { updater } from "../service/updater.tsx";
import Shop from "../page/Shop.tsx";
import Cart from "../page/Cart.tsx";
import ProductDetail from "../page/ProductDetail.tsx";
import NotFoundPage from "../page/404.tsx";
import ServerErrorPage from "../page/500.tsx";
import Checkout from "../page/Checkout.tsx";
import CheckoutSuccess from "../page/CheckoutSuccess.tsx";
import Login from "../page/admin/Login.tsx";
import AdminHome from "../page/admin/AdminHome.tsx";
    import TrackingOrder from "../page/TrackingOrder.tsx";
    import TrackingOrderDetail from "../page/TrackingOrderDetail.tsx";
    import UserLogin from "../page/UserLogin.tsx";
    import Register from "../page/Register.tsx";

function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Home />} />
            <Route path="/shop/*" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/tracking-order" element={<TrackingOrder />} />
            <Route path={"/tracking-order/:id"} element={<TrackingOrderDetail />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/404' element={<NotFoundPage />} />
            <Route path='/500' element={<ServerErrorPage />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/checkout/success/:id' element={<CheckoutSuccess />} />
            <Route path='/admin/login' element={<Login />} />
            <Route path='/admin/*' element={<AdminHome />} />
            <Route path='/user/login' element={<UserLogin />} />
            <Route path='/user/register' element={<Register />} />
        </Routes>
    )
}

export default updater(MainRouter)
