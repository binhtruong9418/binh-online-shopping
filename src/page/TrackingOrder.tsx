import DefaultLayout from "./layout/DefaultLayout.tsx";
import {Input, Typography} from "antd";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import DysonApi from "../axios/DysonApi.ts";
import {toast} from "react-toastify";

const TrackingOrder = () => {
    const navigate = useNavigate()
    const [orderId, setOrderId] = useState<string>('')

    const handleTracking = async () => {
        try {
            const order = await DysonApi.getOrderById(orderId)
            if (order) {
                navigate(`/tracking-order/${orderId}`)
            }
        } catch (error: any) {
            console.log(error.message)
            toast.error("Order not found")
        }
    }
    return (
        <DefaultLayout>
            <div className={'d-flex flex-column align-items-center mx-auto mt-5'}>
                <Typography.Title level={2}>
                    Tracking Order
                </Typography.Title>
                <Typography.Paragraph>
                    Please input your order id here
                </Typography.Paragraph>
                <Input
                    placeholder={"Order id"}
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
                >Tracking
                </button>
            </div>
        </DefaultLayout>
    )
}

export default TrackingOrder