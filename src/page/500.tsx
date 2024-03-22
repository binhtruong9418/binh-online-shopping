import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout'
import {useTranslation} from "react-i18next";

const ServerError= () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    return (
        <DefaultLayout>
            <Result
                status="500"
                title="500"
                subTitle={t("Có lỗi xảy ra.")}
                style={{
                    margin: 'auto',
                }}
                extra={<Button type="primary" style={{ backgroundColor: '#fbb710' }} onClick={() => navigate('/')}>
                    {t("Trở về trang chủ")}
                </Button>}
            />
        </DefaultLayout>
    )
}

export default ServerError
