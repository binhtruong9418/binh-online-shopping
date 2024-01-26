import {Button, Divider, Modal, Pagination, Popconfirm, Select, Space, Table, Tag} from "antd";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import DysonApi from "../../axios/DysonApi";
import { toast } from "react-toastify";
import {ORDER_STATUS, ORDER_STATUS_LABEL} from "../../constants";
import {CheckCircleOutlined, MinusCircleOutlined, SyncOutlined,} from "@ant-design/icons";
import {RiRefund2Line} from "react-icons/ri";
import {MdOutlineLocalShipping} from "react-icons/md";

const expandableProduct = (products: any) => {
    const columns = [
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
            render: (productId: number) => <p>{productId}</p>,
        },
        {
            title: 'Name',
            dataIndex: 'productName',
            key: 'productName',
            render: (productName: string) => <p>{productName}</p>,
        },
        {
            title: 'Quantity',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
            render: (productQuantity: number) => <p>{productQuantity}</p>,
        },
        {
            title: 'Price',
            dataIndex: 'productPrice',
            key: 'productPrice',
            render: (productPrice: number) => <p>{productPrice}</p>,
        },
    ]

    const listProduct = products.map((product: any, index: number) => {
        return {
            key: index,
            productId: product._id,
            productName: product.name,
            productQuantity: product.quantity,
            productPrice: product.currentPrice,
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateOrderId, setUpdateOrderId] = useState<string>("");
    const [updateOrderStatus, setUpdateOrderStatus] = useState("");
    const [dataSearch, setDataSearch] = useState<any>({
        page: 1,
        limit: 10,
        sort: '-createdAt',
        status: undefined,
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
                    quantity: e.quantity
                }
            }))

            return {
                key: order._id,
                orderId: order._id,
                orderDate: order.createdAt,
                shippingDetail: order.shippingDetail,
                note: order.note,
                orderStatus: order.status,
                total: order.totalPayment,
                products: productData,
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
            title: 'Order Date',
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
            title: 'Shipping Detail',
            dataIndex: 'shippingDetail',
            key: 'shippingDetail',
            render: (shippingDetail: any) =>
                <div>
                    <p>{shippingDetail.name} {shippingDetail.phone}</p>
                    <p>{shippingDetail.email}</p>
                    <p>{shippingDetail.address}</p>
                    <Divider />
                    <p>Privince/City: {shippingDetail.province}</p>
                    <p>Distric/Town: {shippingDetail.district}</p>
                    <p>Ward: {shippingDetail.ward}</p>
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
            title: 'Order Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status: string) => {
                switch (status) {
                    case ORDER_STATUS.PENDING:
                        return <Tag icon={<SyncOutlined spin/>} color="processing">
                            {'Pending'}
                        </Tag>
                    case ORDER_STATUS.PAID:
                        return <Tag color="blue">{"Paid"}</Tag>
                    case ORDER_STATUS.CONFIRMED:
                        return <Tag icon={<CheckCircleOutlined/>} color="success">{"Confirmed"}</Tag>
                    case ORDER_STATUS.CANCELLED:
                        return <Tag icon={<MinusCircleOutlined/>} color="red">{"Cancelled"}</Tag>
                    case ORDER_STATUS.REFUNDED:
                        return <Tag icon={<RiRefund2Line className={'mr-1'}/>} color="red"
                                    className={'items-center flex'}>{"Refund"}</Tag>
                    case ORDER_STATUS.DELIVERING:
                        return <Tag icon={<MdOutlineLocalShipping className={'mr-1'}/>} color="blue"
                                    className={'items-center flex'}>{"Delivering"}</Tag>
                    case ORDER_STATUS.DELIVERED:
                        return <Tag icon={<CheckCircleOutlined/>} color="success">{"Delivered"}</Tag>
                    default:
                        return <Tag icon={<SyncOutlined/>} color="processing">
                            {"Pending"}
                        </Tag>
                }
            },
            width: 120,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => <p>{total}$</p>,
            width: 100,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => {return (
                <Space
                    direction={"vertical"}
                >
                    <Popconfirm
                        title={"Do you want to confirm this order?"}
                        onConfirm={async () => await handleConfirmOrder(record)}
                        disabled={record.status !== ORDER_STATUS.PAID}
                    >

                        <Button
                            type={"primary"}
                            icon={<CheckCircleOutlined/>}
                            className={'w-32 items-center justify-center flex bg-green-500'}
                            disabled={record.status !== ORDER_STATUS.PAID}
                        >
                            {"Confirm"}
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title={"Do you want to refund this order?"}
                        onConfirm={async () => await handleRefundOrder(record)}
                        disabled={record.status !== ORDER_STATUS.CANCELLED}
                    >
                        <Button
                            type={"primary"}
                            icon={<RiRefund2Line className={'text-lg'}/>}
                            className={'w-32 items-center justify-center flex bg-amber-700'}
                            disabled={record.status !== ORDER_STATUS.CANCELLED}
                        >{"Refund"}</Button>
                    </Popconfirm>
                    <Popconfirm
                        title={"Do you want to update this order to delivering?"}
                        onConfirm={async () => await handleUpdateDeliveringOrder(record)}
                        disabled={record.status !== ORDER_STATUS.CONFIRMED}
                    >

                        <Button
                            type={"primary"}
                            icon={<MdOutlineLocalShipping className={'text-lg'}/>}
                            className={'w-32 items-center justify-center flex'}
                            disabled={record.status !== ORDER_STATUS.CONFIRMED}
                        >{"Delivering"}</Button>
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
                toast.success('Confirm order successfully')
                await refetch()
            }
        } catch (error) {
            toast.error('Confirm order failed')
        }
    }

    const handleRefundOrder = async (record: any) => {
        try {
            const refundStatus = await DysonApi.updateOrderStatus(record.orderId, ORDER_STATUS.REFUNDED)
            if (refundStatus) {
                toast.success('Refund order successfully')
                await refetch()
            }
        } catch (error) {
            toast.error('Refund order failed')
        }
    }

    const handleUpdateDeliveringOrder = async (record: any) => {
        try {
            const updateStatus = await DysonApi.updateOrderStatus(record.orderId, ORDER_STATUS.DELIVERING)
            if (updateStatus) {
                toast.success('Update order status successfully')
                await refetch()
            }
        } catch (error) {
            toast.error('Update order status failed')
        }
    }

    const handleUpdateOrderStatus = async () => {
        try {
            const updateStatus = await DysonApi.updateOrderStatus(updateOrderId, updateOrderStatus)
            if (updateStatus) {
                toast.success('Update order status successfully')
                await refetch()
                setIsModalVisible(false)
                setUpdateOrderId("")
                setUpdateOrderStatus("")
            }
        } catch (error) {
            toast.error('Update order status failed')
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
                        placeholder="Select Status"
                        style={{width: '200px'}}
                        onChange={(value) => {
                            setDataSearch({
                                ...dataSearch,
                                status: value,
                            })
                        }}
                        value={dataSearch.status}
                    >
                        <Select.Option value={undefined}>All</Select.Option>
                        {
                            ORDER_STATUS_LABEL .map((status: any) => (
                                <Select.Option key={status.value} value={status.value}>{status.label}</Select.Option>
                            ))
                        }
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
                        <Select.Option value={'-createdAt'}>Newest</Select.Option>
                        <Select.Option value={'createdAt'}>Oldest</Select.Option>
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
            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                title="Update Order Status"
                footer={null}
            >
                <p>Order ID: {updateOrderId}</p>
                <div>
                    <Select
                        options={[
                            {
                                label: 'Create',
                                value: 'create',
                            },
                            {
                                label: 'Confirm',
                                value: 'confirm',
                            },
                            {
                                label: 'Delivering',
                                value: 'delivering',
                            },
                            {
                                label: 'Cancel',
                                value: 'cancel',
                            },
                            {
                                label: 'Success',
                                value: 'success',
                            },
                        ]}
                        onChange={(value) => setUpdateOrderStatus(value)}
                        placeholder="Select a status"
                    />
                </div>
                <Button onClick={handleUpdateOrderStatus} className="w-100 mt-4" type="primary">
                    Yes
                </Button>
            </Modal>
        </div>
    )
}