import '../public/css/core-style.css'
import {BrowserRouter} from "react-router-dom";
import MainRouter from "./routes";
import {useCookies} from "react-cookie";
import {useEffect} from "react";
import 'react-toastify/dist/ReactToastify.css';
import DysonApi from './axios/DysonApi.ts';

function App() {
    const [cookies, setCookie] = useCookies(['cart']);
    useEffect(() => {
        if (!cookies.cart) {
            DysonApi.createCart().then((res) => {
                setCookie('cart', res, {path: '/'});
            })
        }
    }, [cookies])


    return (
        <BrowserRouter>
            <MainRouter/>
        </BrowserRouter>
    )
}

export default App
