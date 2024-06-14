import {Button, Divider, Pagination, Popconfirm, Select, Space, Table, Tag} from "antd";
import moment from "moment";
import {useState} from "react";
import {useQuery} from "react-query";
import DysonApi from "../../axios/DysonApi.ts";
import {toast} from "react-toastify";
import {ORDER_STATUS, ORDER_STATUS_LABEL} from "../../constants";
import {CheckCircleOutlined, MinusCircleOutlined, SyncOutlined,} from "@ant-design/icons";
import {RiRefund2Line} from "react-icons/ri";
import {MdOutlineLocalShipping} from "react-icons/md";

const expandableProduct = (products: any) => {
    const columns = [
        {
            title: 'ID sản phẩm',
            dataIndex: 'productId',
            key: 'productId',
            render: (productId: number) => <p>{productId}</p>,
        },
        {
            title: 'Tên',
            dataIndex: 'productName',
            key: 'productName',
            render: (productName: string) => <p>{productName}</p>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
            render: (productQuantity: number) => <p>{productQuantity}</p>,
        },
        {
            title: 'Giá',
            dataIndex: 'productPrice',
            key: 'productPrice',
            render: (productPrice: number) => <p>{productPrice?.toLocaleString('vi-VN')}₫</p>,
        },
    ]

    const listProduct = products.map((product: any, index: number) => {
        return {
            key: index,
            productId: product._id,
            productName: product.name,
            productQuantity: product.quantity,
            productPrice: product.orderPrice,
        }
    })

    return (
        <Table
            columns={columns}
            dataSource={listProduct}
            pagination={false}
            size="small"
        />
    )
}

export default function OrderTable(): JSX.Element {
    const [dataSearch, setDataSearch] = useState<any>({
        page: 1,
        limit: 10,
        sort: '-createdAt',
        status: undefined,
        paymentMethod: undefined,
    })

    const {
        data: {listOrder, totalOrder} = {listOrder: [], totalOrder: 0},
        isLoading: isLoadingListOrder,
        isError: isErrorListOrder,
        refetch
    } = useQuery(['getAllOrder', dataSearch], async ({queryKey}) => {
        const listOrderData = await DysonApi.getAllOrder(queryKey[1]);
        const {items, count} = listOrderData
        const listOrderTable = await Promise.all(items.map(async (order: any) => {
            const productData = await Promise.all(order.products.map(async (e: any) => {
                const product = await DysonApi.getProductById(e.productId);
                return {
                    ...product,
                    quantity: e.quantity,
                    orderPrice: e.price,
                }
            }))

            return {
                key: order._id,
                orderId: order._id,
                orderDate: order.createdAt,
                shippingDetail: order.shippingDetail,
                note: order.note,
                status: order.status,
                total: order.totalPayment,
                products: productData,
                paymentMethod: order.paymentMethod,
            }
        }))

        return {
            listOrder: listOrderTable,
            totalOrder: count
        }
    }, {
        refetchOnWindowFocus: false,
    })


    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderId',
            key: 'orderId',

        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (orderDate: string) => (
                <div>
                    <p>{moment(orderDate).format('HH:MM')}</p>
                    <p>{moment(orderDate).format('DD/MM/YYYY')}</p>
                </div>
            ),
            width: 100,
        },
        {
            title: 'Thông tin giao hàng',
            dataIndex: 'shippingDetail',
            key: 'shippingDetail',
            render: (shippingDetail: any) =>
                <div>
                    <p>{shippingDetail.name} {shippingDetail.phone}</p>
                    <p>{shippingDetail.email}</p>
                    <p>{shippingDetail.address}</p>
                    <Divider/>
                    <p>Tỉnh/Thành phố: {shippingDetail.province}</p>
                    <p>Quận/Huyện: {shippingDetail.district}</p>
                    <p>Xã/Xóm: {shippingDetail.ward}</p>
                </div>,
            width: 400,
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) => <p>{note}</p>,
            width: 100,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (paymentMethod: string) => <p className={'text-uppercase'}>{paymentMethod}</p>,
            width: 100,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                switch (status) {
                    case ORDER_STATUS.PENDING:
                        return <Tag icon={<SyncOutlined spin/>} color="processing">
                            {'Đang chờ'}
                        </Tag>
                    case ORDER_STATUS.PAID:
                        return <Tag color="blue">{"Đã thanh toán"}</Tag>
                    case ORDER_STATUS.CONFIRMED:
                        return <Tag icon={<CheckCircleOutlined/>} color="success">{"Đã xác nhận"}</Tag>
                    case ORDER_STATUS.CANCELLED:
                        return <Tag icon={<MinusCircleOutlined/>} color="red">{"Đã hủy"}</Tag>
                    case ORDER_STATUS.REFUNDED:
                        return <Tag icon={<RiRefund2Line className={'mr-1'}/>} color="red"
                                    className={'items-center flex'}>{"Đã hoàn tiền"}</Tag>
                    case ORDER_STATUS.DELIVERING:
                        return <Tag icon={<MdOutlineLocalShipping className={'mr-1'}/>} color="blue"
                                    className={'items-center flex'}>{"Đang giao"}</Tag>
                    case ORDER_STATUS.DELIVERED:
                        return <Tag icon={<CheckCircleOutlined/>} color="success">{"Đã giao"}</Tag>
                    default:
                        return <Tag icon={<SyncOutlined/>} color="processing">
                            {"Đang chờ"}
                        </Tag>
                }
            },
            width: 120,
        },
        {
            title: 'Tổng',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => <p>{total.toLocaleString('vi-VN')}₫</p>,
            width: 100,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => {
                return (
                    <Space
                        direction={"vertical"}
                    >
                        <Popconfirm
                            title={"Bạn muốn xác nhận đơn hàng này?"}
                            onConfirm={async () => await handleConfirmOrder(record)}
                            disabled={record.status !== ORDER_STATUS.PAID}
                        >

                            <Button
                                type={"primary"}
                                icon={<CheckCircleOutlined/>}
                                className={'w-32 items-center justify-center flex bg-green-500'}
                                disabled={record.status !== ORDER_STATUS.PAID}
                            >
                                {"Xác nhận"}
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title={"Bạn muốn hoàn tiền đơn hàng này?"}
                            onConfirm={async () => await handleRefundOrder(record)}
                            disabled={record.status !== ORDER_STATUS.CANCELLED}
                        >
                            <Button
                                type={"primary"}
                                icon={<RiRefund2Line className={'text-lg'}/>}
                                className={'w-32 items-center justify-center flex bg-amber-700'}
                                disabled={record.status !== ORDER_STATUS.CANCELLED}
                            >{"Hoàn tiền"}</Button>
                        </Popconfirm>
                        <Popconfirm
                            title={"Bạn muốn cập nhật trạng thái đang giao hàng?"}
                            onConfirm={async () => await handleUpdateDeliveringOrder(record)}
                            disabled={record.status !== ORDER_STATUS.CONFIRMED}
                        >

                            <Button
                                type={"primary"}
                                icon={<MdOutlineLocalShipping className={'text-lg'}/>}
                                className={'w-32 items-center justify-center flex'}
                                disabled={record.status !== ORDER_STATUS.CONFIRMED}
                            >{"Đang giao"}</Button>
                        </Popconfirm>

                        <Popconfirm
                            title={"Bạn có muốn cập nhật trạng thái đơn hàng?"}
                            onConfirm={async () => await handleUpdateDeliveredOrder(record)}
                            disabled={record.status !== ORDER_STATUS.DELIVERING}
                        >

                            <Button
                                type={"primary"}
                                icon={<MdOutlineLocalShipping className={'text-lg'}/>}
                                className={'w-32 items-center justify-center flex'}
                                disabled={record.status !== ORDER_STATUS.DELIVERING}
                            >{"Đã giao"}</Button>
                        </Popconfirm>
                    </Space>
                );
            },
            width: 100,
        }

    ]

    const handleConfirmOrder = async (record: any) => {
        try {
            const confirmStatus = await DysonApi.updateOrderStatus(record.orderId, ORDER_STATUS.CONFIRMED)
            if (confirmStatus) {
                toast.success('Xác nhận đơn hàng thành công')
                await refetch()
            }
        } catch (error) {
            toast.error('Xác nhận đơn hàng thất bại')
        }
    }

    const handleRefundOrder = async (record: any) => {
        try {
            const refundStatus = await DysonApi.updateOrderStatus(record.orderId, ORDER_STATUS.REFUNDED)
            if (refundStatus) {
                toast.success('Hoàn tiền thành công')
                await refetch()
            }
        } catch (error) {
            toast.error('Hoàn tiền thất bại')
        }
    }

    const handleUpdateDeliveringOrder = async (record: any) => {
        try {
            const updateStatus = await DysonApi.updateOrderStatus(record.orderId, ORDER_STATUS.DELIVERING)
            if (updateStatus) {
                toast.success('Cập nhật trạng thái thành công')
                await refetch()
            }
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại')
        }
    }
    const handleUpdateDeliveredOrder = async (record: any) => {
        try {
            const updateStatus = await DysonApi.updateOrderStatus(record.orderId, ORDER_STATUS.DELIVERED)
            if (updateStatus) {
                toast.success('Cập nhật trạng thái thành công')
                await refetch()
            }
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại')
        }
    }


    if (isErrorListOrder) {
        return <p>Error when fetching list order</p>
    }
    return (
        <div className={'pt-3'}>
            <div className={'ml-3 mb-4'}>
                <Space>
                    <Select
                        placeholder="Lọc trạng thái"
                        style={{width: '200px'}}
                        onChange={(value) => {
                            setDataSearch({
                                ...dataSearch,
                                status: value,
                            })
                        }}
                        value={dataSearch.status}
                    >
                        <Select.Option value={undefined}>Tất cả</Select.Option>
                        {
                            ORDER_STATUS_LABEL.map((status: any) => (
                                <Select.Option key={status.value} value={status.value}>{status.label}</Select.Option>
                            ))
                        }
                    </Select>
                    <Select
                        placeholder={"Phương thức thanh toán"}
                        style={{width: '200px'}}
                        onChange={(value) => {
                            setDataSearch({
                                ...dataSearch,
                                paymentMethod: value,
                            })
                        }}
                        value={dataSearch.paymentMethod}
                    >
                        <Select.Option value={undefined}>Tất cả</Select.Option>
                        <Select.Option value={'cod'}>COD</Select.Option>
                        <Select.Option value={'vnpay'}>VNPAY</Select.Option>
                    </Select>
                    <Select
                        placeholder="Sort"
                        style={{width: '150px'}}
                        onChange={(value) => {
                            setDataSearch({
                                ...dataSearch,
                                sort: value,
                            })
                        }}
                        value={dataSearch.sort}
                    >
                        <Select.Option value={'-createdAt'}>Mới nhất</Select.Option>
                        <Select.Option value={'createdAt'}>Cũ nhất</Select.Option>
                    </Select>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={listOrder}
                size="small"
                expandable={{
                    expandedRowRender: (record) => {
                        return expandableProduct(record.products)
                    },
                }}
                pagination={false}
                bordered
                scroll={{x: '50vw'}}
                loading={isLoadingListOrder}
            />
            <Pagination
                className="mt-4"
                current={dataSearch.page}
                total={totalOrder}
                pageSize={dataSearch.limit}
                onChange={(page, pageSize) => {
                    setDataSearch({
                        ...dataSearch,
                        page,
                        limit: pageSize || 10,
                    })
                }}
            />
        </div>
    )
}