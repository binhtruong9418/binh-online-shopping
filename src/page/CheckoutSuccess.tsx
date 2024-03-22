import { Result } from "antd"
import { useParams } from "react-router-dom"
import DefaultLayout from "./layout/DefaultLayout"
import {useTranslation} from "react-i18next";

const CheckoutSuccess = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    return (
        <DefaultLayout>
            <Result
                status="success"
                title={"Cảm ơn bạn đã đặt hàng với chúng tôi!"}
                subTitle={<div>
                    <p>{t("Mã số đơn hàng của bạn là: ")} {id}</p>
                    <p>{t("Bạn có thể sử dụng mã đơn hàng để kiểm tra trạng thái đơn hàng")}</p>
                    <p>
                        {t("Chúng tôi sẽ liên hệ với bạn qua email")}
                    </p>
                </div>}
                className="m-auto"
            />
        </DefaultLayout>
    )
}

export default CheckoutSuccess
