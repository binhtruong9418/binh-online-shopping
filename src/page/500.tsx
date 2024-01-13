import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import DefaultLayout from './layout/DefaultLayout'

const notfound = () => {
    const navigate = useNavigate()
    return (
        <DefaultLayout>
            <Result
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
                style={{
                    margin: 'auto',
                }}
                extra={<Button type="primary" style={{ backgroundColor: '#fbb710' }} onClick={() => navigate('/')}>Back Home</Button>}
            />
        </DefaultLayout>
    )
}

export default notfound