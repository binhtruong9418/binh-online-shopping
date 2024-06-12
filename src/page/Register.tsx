import "./login.css";
import {Button, Image} from "antd";
import Logo from '../assets/img/logo.png'
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import AddressJson from "../config/AddressJson.json";
import {toast} from "react-toastify";
import {isValidEmail} from "../utils";
import DysonApi from "../axios/DysonApi.ts";

const Register = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [isOpenProvinceDropdown, setIsOpenProvinceDropdown] = useState<boolean>(false)
    const [isOpenDistrictDropdown, setIsOpenDistrictDropdown] = useState<boolean>(false)
    const [isOpenWardDropdown, setIsOpenWardDropdown] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [province, setProvince] = useState<string>('')
    const [district, setDistrict] = useState<string>('')
    const [ward, setWard] = useState<string>('')
    const [listDistrict, setListDistrict] = useState<any[]>([])
    const [listWard, setListWard] = useState<any[]>([])
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const listProvince = JSON.parse(JSON.stringify(AddressJson))
    const handleRegister = async () => {
        if(!email || !password || !confirmPassword) {
            return toast.error("Vui lòng nhập email và mật khẩu")
        }

        if(!isValidEmail(email)) {
            return toast.error("Email không hợp lệ")
        }

        if(password !== confirmPassword) {
            return toast.error("Mật khẩu không khớp")
        }

        try {
            const request = {
                email,
                password,
                name,
                phone,
                address,
                province,
                district,
                ward
            }

            await DysonApi.register(request)
            toast.success("Đăng ký thành công")
            navigate("/user/login")
        } catch (err: any) {
            if(err.error === 'User already exists') {
                toast.error("Email đã tồn tại")
            } else {
                toast.error(err.error || "Lỗi đăng ký")
            }
        }
    }


    const handleSelectProvince = (province: any) => {
        setProvince(province.name)
        const district = listProvince.find((item: any) => item.codename === province.codename)

        setListDistrict(district.districts)
    }

    const handleSelectDistrict = (district: any) => {
        setDistrict(district.name)
        const ward = listDistrict.find((item: any) => item.codename === district.codename)
        setListWard(ward.wards)
    }
    const handleSelectWard = (ward: any) => {
        setWard(ward.name)
    }
    return (
        <main className="login-page pt-3">
            <div className="login-card" style={{
                overflow: 'auto',
                maxHeight: '100%'
            }}>
                <div className="login-card-header">
                    <div>
                        <Image width={200} src={Logo} preview={false}/>
                    </div>
                    <div className="login-title">{t('Xin chào')}</div>
                    <p className="login-description">{t("Đăng ký tài khoản mới")}</p>
                </div>
                <form>
                    <div className="row">

                        <div className="col-12 mb-4">
                            <input
                                name='email'
                                type="email"
                                className="form-control"
                                value={email}
                                placeholder={`Email *`}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="col-12 mb-4">
                            <input
                                name='password'
                                type="password"
                                className="form-control"
                                value={password}
                                placeholder={t("Mật khẩu *")}
                                onChange={(e) => setPassword(e.target.value)}
                                required/>
                        </div>
                        <div className="col-12 mb-4">
                            <input
                                name='confirmPassword'
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                placeholder={t("Xác nhận mật khẩu *")}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required/>
                        </div>
                        <div className="col-12 mb-4">
                            <input
                                name='name'
                                type="text"
                                className="form-control"
                                value={name}
                                placeholder={t("Tên đầy đủ")}
                                onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="col-12 mb-4">
                            <input
                                name='phone'
                                type="tel"
                                className="form-control"
                                value={phone}
                                placeholder={t("Số điện thoại")}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="col-12 mb-3">
                            <input
                                name='address'
                                type="text"
                                className="form-control mb-3"
                                placeholder={t("Địa chỉ cụ thể")}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="col-12 mb-4">
                            <div className={isOpenProvinceDropdown ?
                                "nice-select w-100 open" :
                                "nice-select w-100"}
                                 onClick={() => setIsOpenProvinceDropdown(!isOpenProvinceDropdown)}
                            >
                                <span className="current pl-2">
                                    {province ? province : t("Tỉnh, thành phố")}
                                </span>
                                <ul className="list w-100" style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {
                                        listProvince.map((item: any) => (
                                            <li className="option"
                                                onClick={() => handleSelectProvince(item)}
                                                key={item.codename}>{item.name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>

                        <div className="col-12 mb-4">
                            <div className={isOpenDistrictDropdown ?
                                "nice-select w-100 open" :
                                "nice-select w-100"}
                                 onClick={() => setIsOpenDistrictDropdown(!isOpenDistrictDropdown && listDistrict.length > 0)}
                            >
                                <span className="current pl-2">
                                    {district ? district : t("Quận, huyện")}
                                </span>
                                <ul className="list w-100" style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {
                                        listDistrict.map((item: any) => (
                                            <li key={item.codename} className="option"
                                                onClick={() => handleSelectDistrict(item)}>{item.name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 mb-4">
                            <div className={isOpenWardDropdown ?
                                "nice-select w-100 open" :
                                "nice-select w-100"}
                                 onClick={() => setIsOpenWardDropdown(!isOpenWardDropdown && listWard.length > 0 && listDistrict.length > 0)}
                            >
                                <span className="current pl-2">
                                    {ward ? ward : t("Xã, phường")}</span>
                                <ul className="list w-100" style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {
                                        listWard.map((item: any) => (
                                            <li key={item.codename} className="option"
                                                onClick={() => handleSelectWard(item)}>{item.name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>

                <Button
                    type="primary"
                    onClick={handleRegister}
                    className="login-btn bg-black mt-3"
                    size="large"
                >
                    {t("Đăng ký")}
                </Button>
                <div className={'mt-3 text-center'}>
                    <span className={'text-sm'}>{t("Đã có tài khoản?")}</span>
                    <Link to={'/user/login'} className={'text-blue-500 text-sm'}>
                        {t(" Đăng nhập")}
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Register;