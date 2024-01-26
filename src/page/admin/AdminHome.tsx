import { InboxOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import ProductTable from '../../compoments/admin/ProductTable';
import { useEffect, useState } from 'react';
import CategoryTable from '../../compoments/admin/CategoryTable';
import OrderTable from '../../compoments/admin/OrderTable';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from "../../assets/img/logo.png";

const { Header, Content, Sider } = Layout;

const AdminHome = () => {
    const [tab, setTab] = useState('1')
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    const jwtToken = localStorage.getItem('jwtToken');
    useEffect(() => {
        if (!userInfo || !jwtToken) {
            window.location.href = '/'
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('jwtToken');
        window.location.href = '/'
    }
    return userInfo && jwtToken && (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                collapsible={true}
            >
                <div className="logo my-3">
                    <a href="#"><img src={Logo} alt=""/></a>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={(e) => setTab(e.key)}
                    items={[
                        {
                            icon: <InboxOutlined/>,
                            label: 'Manage Product',
                            key: '1',
                        },

                        {
                            icon: <InboxOutlined/>,
                            label: 'Manage Category',
                            key: '2',
                        },

                        {
                            icon: <InboxOutlined/>,
                            label: 'Manage Order',
                            key: '3',
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{padding: 20, background: '#fff'}}
                        className='d-flex justify-content-between align-items-center'>
                    <Link to='/'>
                        <HomeOutlined style={{ fontSize: 25, cursor: 'pointer' }} />
                    </Link>
                    <Button type="primary" danger onClick={handleLogout}>Logout</Button>
                </Header>
                <Content style={{ paddingTop: 50 }}>
                    {
                        tab === '1' &&
                        <div style={{ height: '100%', background: '#fff' }}>
                            <ProductTable />
                        </div>

                    }
                    {
                        tab === '2' &&
                        <div style={{ height: '100%', background: '#fff' }}>
                            <CategoryTable />
                        </div>

                    }
                    {
                        tab === '3' &&
                        <div style={{ height: '100%', background: '#fff' }}>
                            <OrderTable />
                        </div>
                    }
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminHome;