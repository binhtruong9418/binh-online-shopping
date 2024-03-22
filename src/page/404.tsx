import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout'
import {useTranslation} from "react-i18next";

const Notfound= () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    return (
        <DefaultLayout>
            <Result
                status="404"
                title="404"
                subTitle={t('Xin lỗi, trang bạn đang tìm không tồn tại.')}
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

export default Notfound
