import { useState } from 'react'
import AddressJson from '../config/AddressJson.json'
import { toast } from 'react-toastify'
import { useQuery } from 'react-query'
import DysonApi from '../axios/DysonApi'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout'
const Checkout = () => {
    const navigate = useNavigate()
    const [cookies] = useCookies(['cart']);

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
    const [note, setNote] = useState<string>('')
    const [listDistrict, setListDistrict] = useState<any[]>([])
    const [listWard, setListWard] = useState<any[]>([])
    const listProvince = JSON.parse(JSON.stringify(AddressJson))

    const [isCod, setIsCod] = useState<boolean>(false)


    const {
        data: { totalAmount } = {},
    } = useQuery(['myCart'], async () => {
        const res = await DysonApi.getCart(cookies.cart);
        const listData = await Promise.all(res.products.map(async (e: any) => {
            const product = await DysonApi.getProductById(e.productId);
            return {
                currentPrice: product.currentPrice,
                quantity: e.quantity
            }
        }))

        const totalAmount = listData.reduce((acc: number, cur: any) => acc + cur.currentPrice * cur.quantity, 0)
        return {
            totalAmount
        }
    }, {
        enabled: !!cookies.cart
    })

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
    const handleSubmit = async () => {
        if (!name || !phone || !address || !province || !district || !ward) {
            toast.error('Please fill all field', { position: 'top-left' })
            return;
        }

        if (totalAmount === 0) {
            toast.error('Cart is empty', { position: 'top-left' })
            return;
        }

        try {
            const data = {
                cartId: cookies.cart,
                address: address,
                province: province,
                district: district,
                ward: ward,
                name: name,
                phone: phone,
                email: email,
                note: note,
                paymentMethod: isCod ? 'cod' : 'vnpay',
            }
            const newOrder = await DysonApi.createOrder(data)
            if(isCod) {
                toast.success('Order success', { position: 'top-left' })
                navigate(`/checkout/success/${newOrder._id}`)
            } else {
                const vnpayUrl = await DysonApi.createVnpayPaymentUrl(newOrder._id)
                window.location.href = vnpayUrl
            }
        } catch (error) {
            toast.error('Order failed', { position: 'top-left' })
        }
    }
    return (
        <DefaultLayout>
            <div className="cart-table-area section-padding-100">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-lg-8">
                            <div className="checkout_details_area mt-50 clearfix">
                                <div className="cart-title">
                                    <h2>Checkout</h2>
                                </div>

                                <form>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <input
                                                name='name'
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                placeholder="Full Name"
                                                onChange={(e) => setName(e.target.value)}
                                                required />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <input
                                                name='phone'
                                                type="tel"
                                                className="form-control"
                                                value={phone}
                                                placeholder="Phone Number"
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 mb-3">
                                            <input
                                                name='email'
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                placeholder="Email (Optional)"
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className={isOpenProvinceDropdown ?
                                                "nice-select w-100 open" :
                                                "nice-select w-100"}
                                                onClick={() => setIsOpenProvinceDropdown(!isOpenProvinceDropdown)}
                                            >
                                                <span className="current pl-2">{province ? province : "Province"}</span>
                                                <ul className="list">
                                                    {
                                                        listProvince.map((item: any) => (
                                                            <li className="option" onClick={() => handleSelectProvince(item)} key={item.codename}>{item.name}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className={isOpenDistrictDropdown ?
                                                "nice-select w-100 open" :
                                                "nice-select w-100"}
                                                onClick={() => setIsOpenDistrictDropdown(!isOpenDistrictDropdown && listDistrict.length > 0)}
                                            >
                                                <span className="current pl-2">{district ? district : "District"}</span>
                                                <ul className="list">
                                                    {
                                                        listDistrict.map((item: any) => (
                                                            <li key={item.codename} className="option" onClick={() => handleSelectDistrict(item)}>{item.name}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className={isOpenWardDropdown ?
                                                "nice-select w-100 open" :
                                                "nice-select w-100"}
                                                onClick={() => setIsOpenWardDropdown(!isOpenWardDropdown && listWard.length > 0 && listDistrict.length > 0)}
                                            >
                                                <span className="current pl-2">{ward ? ward : "Ward"}</span>
                                                <ul className="list">
                                                    {
                                                        listWard.map((item: any) => (
                                                            <li key={item.codename} className="option" onClick={() => handleSelectWard(item)}>{item.name}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <input
                                                name='address'
                                                type="text"
                                                className="form-control mb-3"
                                                placeholder="Address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <textarea
                                                name="note"
                                                className="form-control w-100"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                cols={30} rows={10}
                                                placeholder="Leave a note about your order"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="cart-summary">
                                <h5>Cart Total</h5>
                                <ul className="summary-table">
                                    <li><span>subtotal:</span> <span>${totalAmount?.toFixed(2)}</span></li>
                                    <li><span>delivery:</span> <span>---</span></li>
                                    <li><span>total:</span> <span>${totalAmount?.toFixed(2)}</span></li>
                                </ul>


                                <div className="payment-method">
                                    <div className="custom-control custom-checkbox mr-sm-2" onClick={() => {
                                        setIsCod(!isCod)
                                    }}>
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            checked={isCod}
                                        />
                                        <label className="custom-control-label">Cash on delivery (COD)</label>
                                    </div>
                                </div>

                                <div className="cart-btn mt-100">
                                    <button onClick={handleSubmit} className="btn amado-btn w-100">Order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Checkout