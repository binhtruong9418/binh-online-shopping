import { Result } from "antd"
import { useParams } from "react-router-dom"
import DefaultLayout from "./layout/DefaultLayout"

const CheckoutSuccess = () => {
    const { id } = useParams()
    return (
        <DefaultLayout>
            <Result
                status="success"
                title="Thanks for your purchase!"
                subTitle={<div>
                    <p>Your order number is: {id}</p>
                    <p>We'll phone you an order confirmation with details and tracking info.</p>
                </div>}
                className="m-auto"
            />
        </DefaultLayout>
    )
}

export default CheckoutSuccess