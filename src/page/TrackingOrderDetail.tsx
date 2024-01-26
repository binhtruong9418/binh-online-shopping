import DefaultLayout from "./layout/DefaultLayout.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import DysonApi from "../axios/DysonApi.ts";
import {Descriptions, Divider, Skeleton, Timeline, Typography} from "antd";
import {CheckCircleOutlined, ClockCircleOutlined} from "@ant-design/icons";
import moment from "moment";
import {MdOutlineLocalShipping} from "react-icons/md";
import {FiBox} from "react-icons/fi";
import {upperCaseFirstLetter} from "../utils";

export default function TrackingOrderDetail() {
    const {id: orderId} = useParams();
    const navigate = useNavigate();
    const {
        data: orderDetail = {},
        isLoading,
    } = useQuery(
        ['getOrderDetail', orderId],
        async ({queryKey}) => {
            const res = await DysonApi.getOrderById(queryKey[1] as string)
            const listProduct = await Promise.all(res.products.map(async (e: any) => {
                const product = await DysonApi.getProductById(e.productId)
                return {
                    ...product,
                    quantity: e.quantity
                }
            }))
            return {
                ...res,
                products: listProduct
            }
        }, {
            enabled: !!orderId
        })
    const totalNotDiscount = orderDetail?.products?.reduce((acc: number, cur: any) => acc + cur.quantity * cur.price, 0)
    const totalDiscount = orderDetail?.products?.reduce((acc: number, cur: any) => acc + cur.quantity * cur.discount * cur.price, 0)
    if (isLoading) {
        return (
            <Skeleton active/>
        )
    }
    return (
        <DefaultLayout>
            <div className="single-product-area section-padding-100 clearfix">
                <div className="container-fluid">
                    <div className="row mb-5">
                        <div className="col-12 text-left mt-3 mt-sm-0">
                            <Typography.Title level={3} style={{marginBottom: '0px'}}>Order id:</Typography.Title>
                            <Typography.Title level={3}>{orderId}</Typography.Title>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <Typography.Title level={4} className={'mb-5'}>
                                Order status
                            </Typography.Title>
                            <Timeline
                                mode="right"
                                style={{
                                    margin: '0 auto',
                                }}
                                items={[
                                    {
                                        label: 'Order created',
                                        color: 'red',
                                        dot: <ClockCircleOutlined style={{fontSize: '16px'}}/>,
                                        children: (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    Order has been created. Please wait for the order to be confirmed.
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        label: 'Order confirmed',
                                        color: 'green',
                                        dot: <FiBox style={{fontSize: '17px'}}/>,
                                        children: orderDetail?.confirmTime ? (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.confirmTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    Your order has been confirmed. Please wait for the product to be
                                                    delivered.
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{height: '60px'}}/>
                                        )
                                    },
                                    {
                                        label: 'Order delivering',
                                        color: 'blue',
                                        dot: <MdOutlineLocalShipping style={{fontSize: '16px'}}/>,
                                        children: orderDetail?.deliveryTime ? (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.deliveryTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    Your order is being delivered. Please wait for the product to be
                                                    delivered.
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{height: '60px'}}/>
                                        )
                                    },
                                    {
                                        label: 'Order delivered',
                                        color: 'green',
                                        dot: <CheckCircleOutlined style={{fontSize: '16px'}}/>,
                                        children: orderDetail?.successTime ? (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.successTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    Your order has been delivered. Thank you for using our service.
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{height: '60px'}}/>
                                        )

                                    }
                                ]}
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <Descriptions title={
                                <Typography.Title level={4}>
                                    Order information
                                </Typography.Title>
                            } layout="vertical" bordered>
                                <Descriptions.Item
                                    label="Customer name">{orderDetail?.shippingDetail?.name}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Customer phone">{orderDetail?.shippingDetail?.phone}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Customer email">{orderDetail?.shippingDetail?.email}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Customer address">{orderDetail?.shippingDetail?.address}</Descriptions.Item>
                                <Descriptions.Item
                                    label={"Customer ward"}>{orderDetail?.shippingDetail?.ward}</Descriptions.Item>
                                <Descriptions.Item
                                    label={"Customer district"}>{orderDetail?.shippingDetail?.district}</Descriptions.Item>
                                <Descriptions.Item
                                    label={"Customer city"}>{orderDetail?.shippingDetail?.city}</Descriptions.Item>

                            </Descriptions>
                        </div>
                    </div>
                    <div className={'row mt-5'}>
                        <div className={'col-12 col-lg-6 border p-3'}>
                            <Typography.Title level={4}>List Product</Typography.Title>
                            <div style={{
                                height: '4px',
                                width: '100%',
                                backgroundColor: '#fbb710',
                                marginBottom: '20px'
                            }}/>
                            {
                                orderDetail?.products?.map((e: any, index: number) => {
                                    return (
                                        <>
                                            {
                                                index !== 0 && <Divider />
                                            }
                                            <div
                                                className={'d-flex align-items-center mb-3'}
                                            >
                                                <img src={e?.images[0]} width={120}/>
                                                <div>
                                                    <div className={'ml-3'}>{upperCaseFirstLetter(e?.name)}</div>
                                                    <div className={'ml-3'}>Price: ${e?.currentPrice}</div>
                                                    <div className={'ml-3'}>Quantity: {e?.quantity}</div>
                                                    <div className={'ml-3 mt-5'}>${e.quantity * e?.currentPrice}</div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                        <div className={'col-12 col-lg-6 border p-3'}>
                            <Typography.Title level={4}>Checkout</Typography.Title>
                            <div style={{
                                height: '4px',
                                width: '100%',
                                backgroundColor: '#fbb710',
                                marginBottom: '20px',
                            }}/>
                            <div>
                                <div className={'d-flex justify-content-between align-items-center mb-1'}>
                                    <div>Order value:</div>
                                    <div>${totalNotDiscount}</div>
                                </div>
                                <div className={'d-flex justify-content-between align-items-center mb-1'}>
                                    <div>Total discount:</div>
                                    <div>- ${totalDiscount}</div>
                                </div>
                                <div className={'d-flex justify-content-between align-items-center mb-1'}>
                                    <div>Delivery charges :</div>
                                    <div>${0}</div>
                                </div>
                                <div className={'d-flex justify-content-between align-items-center'}>
                                    <div>Payment fee:</div>
                                    <div>${0}</div>
                                </div>
                            </div>
                            <Divider />
                            <div className={'d-flex justify-content-between align-items-center'}>
                                <div>Total payment:</div>
                                <div>${totalNotDiscount - totalDiscount}</div>
                            </div>

                            <button
                                type="button"
                                className="btn mt-5"
                                style={{
                                    backgroundColor: '#fbb710',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    padding: '10px 20px',
                                }}
                                onClick={() => {
                                    navigate('/')
                                }}
                            >
                                Back to home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}