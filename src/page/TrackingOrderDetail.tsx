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
import {useTranslation} from "react-i18next";

export default function TrackingOrderDetail() {
    const {id: orderId} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {
        data: orderDetail = {},
        isLoading,
    } = useQuery(
        ['getOrderDetail', orderId],
        async ({queryKey}) => {
            const res = await DysonApi.getOrderById(queryKey[1] as string)
            const listProduct = await Promise.all(res.products.map(async (e: any) => {
                const product = await DysonApi.getProductById(e.productId)
                console.log(product, "product")
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

    console.log(orderDetail)
    const totalNotDiscount = orderDetail?.products?.reduce((acc: number, cur: any) => acc + +cur.quantity * +cur.price, 0)
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
                            <Typography.Title level={3}
                                              style={{marginBottom: '0px'}}>{t("Mã đơn hàng")}:</Typography.Title>
                            <Typography.Title level={3}>{orderId}</Typography.Title>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <Typography.Title level={4} className={'mb-5'}>
                                {t("Trạng thái đơn hàng")}
                            </Typography.Title>
                            <Timeline
                                mode="right"
                                style={{
                                    margin: '0 auto',
                                }}
                                items={[
                                    {
                                        label: t('Đơn hàng đã được tạo'),
                                        color: 'red',
                                        dot: <ClockCircleOutlined style={{fontSize: '16px'}}/>,
                                        children: (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    {t("Đơn hàng đã được tạo. Vui lòng chờ đơn hàng được xác nhận. Vui lòng gọi đường dây nóng 0972 230 803 (trong giờ hành chính) nếu bạn muốn thay đổi thông tin đơn hàng trước khi đơn hàng của bạn được chuyển đến TRẠNG THÁI GIAO HÀNG.")}
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        label: t("Đơn hàng đã được xác nhận"),
                                        color: 'blue',
                                        dot: <FiBox style={{fontSize: '17px'}}/>,
                                        children: orderDetail?.confirmTime ? (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.confirmTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    {t("Đơn hàng của bạn đã được xác nhận. Vui lòng chờ sản phẩm được giao đến.")}
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{height: '60px'}}/>
                                        )
                                    },
                                    {
                                        label: t('Đơn hàng đang được giao'),
                                        color: 'blue',
                                        dot: <MdOutlineLocalShipping style={{fontSize: '16px'}}/>,
                                        children: orderDetail?.deliveryTime ? (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.deliveryTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    {t("Đơn hàng của bạn đang được giao. Vui lòng chờ sản phẩm được giao đến.")}
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{height: '60px'}}/>
                                        )
                                    },
                                    {
                                        label: t('Đơn hàng đã được giao'),
                                        color: 'green',
                                        dot: <CheckCircleOutlined style={{fontSize: '16px'}}/>,
                                        children: orderDetail?.successTime ? (
                                            <div>
                                                <div
                                                    className={'font-bold'}>{moment(orderDetail?.successTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div>
                                                    {t("Đơn hàng của bạn đã được giao. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.")}
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
                                    {t("Thông tin giao hàng")}
                                </Typography.Title>
                            } layout="vertical" bordered>
                                <Descriptions.Item
                                    label={t("Tên khách hàng")}>{orderDetail?.shippingDetail?.name}</Descriptions.Item>
                                <Descriptions.Item
                                    label={t("Số điện thoại")}>{orderDetail?.shippingDetail?.phone}</Descriptions.Item>
                                <Descriptions.Item
                                    label={t("Email")}>{orderDetail?.shippingDetail?.email}</Descriptions.Item>
                                <Descriptions.Item
                                    label={t("Địa chỉ chi tiết")}>{orderDetail?.shippingDetail?.address}</Descriptions.Item>
                                <Descriptions.Item
                                    label={t("Phường, xã")}>{orderDetail?.shippingDetail?.ward}</Descriptions.Item>
                                <Descriptions.Item
                                    label={t("Quận, huyện")}>{orderDetail?.shippingDetail?.district}</Descriptions.Item>
                                <Descriptions.Item
                                    label={t("Tỉnh, thành phố")}>{orderDetail?.shippingDetail?.province}</Descriptions.Item>

                            </Descriptions>
                        </div>
                    </div>
                    <div className={'row mt-5'}>
                        <div className={'col-12 col-lg-6 border p-3'}>
                            <Typography.Title level={4}>
                                {t("Chi tiết đơn hàng")}
                            </Typography.Title>
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
                                                index !== 0 && <Divider/>
                                            }
                                            <div
                                                className={'d-flex align-items-center mb-3'}
                                            >
                                                {
                                                    e.images && e.images.length && (
                                                        <img src={e?.images[0]} width={120}/>
                                                    )
                                                }
                                                <div>
                                                    {
                                                        e?.name && e?.currentPrice ? (
                                                            <>
                                                                <div
                                                                    className={'ml-3'}>{upperCaseFirstLetter(e?.name)}</div>

                                                                <div
                                                                    className={'ml-3'}>{t("Giá")}: {e?.currentPrice.toLocaleString('vi-VN')}₫
                                                                </div>
                                                                <div
                                                                    className={'ml-3'}>{t("Số lượng")}: {e?.quantity}</div>
                                                                <div
                                                                    className={'ml-3 mt-5'}>{(e.quantity * e?.currentPrice).toLocaleString('vi-VN')}₫
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className={'ml-3'}>{t("Số lượng")}: {e?.quantity}</div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                        <div className={'col-12 col-lg-6 border p-3'}>
                            <Typography.Title level={4}>
                                {t("Tổng thanh toán")}
                            </Typography.Title>
                            <div style={{
                                height: '4px',
                                width: '100%',
                                backgroundColor: '#fbb710',
                                marginBottom: '20px',
                            }}/>
                            <div>
                                <div className={'d-flex justify-content-between align-items-center mb-1'}>
                                    <div>{t("Số tiền đơn hàng")}:</div>
                                    <div>{totalNotDiscount?.toLocaleString('vi-VN')}₫</div>
                                </div>
                                <div className={'d-flex justify-content-between align-items-center mb-1'}>
                                    <div>{t("Khuyến mãi")}:</div>
                                    <div>- {totalDiscount?.toLocaleString('vi-VN')}₫</div>
                                </div>
                                <div className={'d-flex justify-content-between align-items-center mb-1'}>
                                    <div>{t("Chi phí vận chuyển")}:</div>
                                    <div>{0?.toLocaleString('vi-VN')}₫</div>
                                </div>
                            </div>
                            <Divider/>
                            <div className={'d-flex justify-content-between align-items-center'}>
                                <div>{t("Tổng cộng")}:</div>
                                <div>{(totalNotDiscount - totalDiscount)?.toLocaleString('vi-VN')}₫</div>
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
                                {t("Quay lại trang chủ")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}
