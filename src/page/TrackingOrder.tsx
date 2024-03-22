import DefaultLayout from "./layout/DefaultLayout.tsx";
import {Input, Typography} from "antd";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import DysonApi from "../axios/DysonApi.ts";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

const TrackingOrder = () => {
    const navigate = useNavigate()
    const [orderId, setOrderId] = useState<string>('')
    const {t} = useTranslation()

    const handleTracking = async () => {
        try {
            const order = await DysonApi.getOrderById(orderId)
            if (order) {
                navigate(`/tracking-order/${orderId}`)
            }
        } catch (error: any) {
            console.log(error.message)
            toast.error(t("Không tìm thấy đơn hàng"))
        }
    }
    return (
        <DefaultLayout>
            <div className={'d-flex flex-column align-items-center mx-auto mt-5'}>
                <Typography.Title level={2}>
                    {t("Kiểm tra đơn hàng")}
                </Typography.Title>
                <Typography.Paragraph>
                    {t("Nhập mã đơn hàng của bạn để kiểm tra trạng thái đơn hàng")}
                </Typography.Paragraph>
                <Input
                    placeholder={(t("Mã đơn hàng"))}
                    style={{width: 300, marginTop: 20, marginBottom: 20}}
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />
                <button
                    type="button"
                    className="btn mt-3"
                    style={{
                        backgroundColor: '#fbb710',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: 200
                    }}
                    onClick={handleTracking}
                >
                    {t("Kiểm tra")}
                </button>
            </div>
        </DefaultLayout>
    )
}

export default TrackingOrder
