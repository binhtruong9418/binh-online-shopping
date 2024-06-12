import "./login.css";
import {Button, Form, Image, Input} from "antd";
import Logo from '../assets/img/logo.png'
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import DysonApi from "../axios/DysonApi.ts";
import {useConnection} from "../redux/connection";
import {useCookies} from "react-cookie";

const UserLogin = () => {
    const [form] = Form.useForm();
    const {t} = useTranslation()
    const {onSetJwtToken} = useConnection()
    const navigate = useNavigate()
    const [, setCookie] = useCookies(['cart']);


    const handleLogin = async (values: { email: string, password: string }) => {
        const {email, password} = values
        if (!email || !password) return toast.error("Please enter email and password")
        try {
            const data = await DysonApi.login(email, password)
            toast.success("Đăng nhập thành công")
            onSetJwtToken(data.jwt)
            if(data.cart) {
                setCookie('cart', data.cart, {path: '/'});
            }
            localStorage.setItem("userInfo", JSON.stringify(data.user))
            navigate("/")
        } catch (error: any) {
            if (error.error === "User does not exist") return toast.error("Người dùng không tồn tại")
            if (error.error === "Password does not match") return toast.error("Mật khẩu không đúng")
            toast.error(error.error || "Lỗi đăng nhập")
        }

    }
    return (
        <main className="login-page pt-3" style={{overflow: 'auto'}}>
            <div className="login-card">
                <div className="login-card-header">
                    <div>
                        <Image width={200} src={Logo} preview={false}/>
                    </div>
                    <div className="login-title">{t('Xin chào')}</div>
                    <p className="login-description">{t('Đăng nhập với tài khoản của bạn')}</p>
                </div>
                <Form
                    form={form}
                    name="login"
                    layout="vertical"
                    onFinish={handleLogin}
                >
                    <Form.Item
                        style={{
                            marginBottom: "2.5rem",
                        }}
                        label={<span className="text-base font-medium">{t("Email")}</span>}
                        name="email"
                        rules={[
                            {required: true, message: t("Vui lòng nhập email!")},
                        ]}
                    >
                        <Input placeholder={t("Email")} className="login-form-input border-black"/>
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-base font-medium">{t("Mật khẩu")}</span>}
                        name="password"
                        rules={[
                            {required: true, message: t("Vui lòng nhập mật khẩu!")},
                        ]}
                    >
                        <Input.Password
                            placeholder={t("Mật khẩu")}
                            className="login-form-input border-black"
                        />
                    </Form.Item>
                </Form>
                <Link to={'/'} className={'text-sm'}>
                    Về trang chủ
                </Link>
                <Button
                    type="primary"
                    onClick={form.submit}
                    className="login-btn bg-black mt-3"
                    size="large"
                >
                    {t("Đăng nhập")}
                </Button>
                <div className={'mt-3 text-center'}>
                    <span className={'text-sm'}>{t("Chưa có tải khoản?")}</span>
                    <Link to={'/user/register'} className={'text-blue-500 text-sm'}>
                        {t(" Đăng ký")}
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default UserLogin;