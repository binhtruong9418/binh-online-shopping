import { Button, Divider, Modal, Select, Table, Tag } from "antd";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import DysonApi from "../../axios/DysonApi";
import { toast } from "react-toastify";

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

    const {
        data: listOrder = [],
        isLoading: isLoadingListOrder,
        isError: isErrorListOrder,
        refetch
    } = useQuery(['getAllOrder'], async () => {
        const listOrder = await DysonApi.getAllOrder();
        const listOrderTable = await Promise.all(listOrder.map(async (order: any) => {
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

        return listOrderTable
    }, {
        refetchOnWindowFocus: false,
    })


    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (orderId: number) => <p>{orderId}</p>,
            width: 100,
        },
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
            width: 120,
            sorter: (a: any, b: any) => moment(a.orderDate).unix() - moment(b.orderDate).unix(),
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
            width: 300,
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) => <p>{note}</p>,
            width: 200,
        },
        {
            title: 'Order Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (orderStatus: string) => {
                switch (orderStatus) {
                    case 'create':
                        return (
                            <Tag icon={<ClockCircleOutlined />} color="default">
                                Create
                            </Tag>
                        )
                    case 'confirm':
                        return (
                            <Tag icon={<CheckCircleOutlined />} color="processing">
                                Confirm
                            </Tag>
                        )
                    case 'delivering':
                        return (
                            <Tag icon={<SyncOutlined spin />} color="processing">
                                Delivering
                            </Tag>
                        )
                    case 'cancel':
                        return (
                            <Tag icon={<CloseCircleOutlined />} color="error">
                                Canceled
                            </Tag>
                        )
                    case 'success':
                        return (
                            <Tag icon={<CheckCircleOutlined />} color="success">
                                Completed
                            </Tag>
                        )
                }
            },
            width: 120,
            filters: [
                {
                    text: 'Create',
                    value: 'create',
                },
                {
                    text: 'Confirm',
                    value: 'confirm',
                },
                {
                    text: 'Delivering',
                    value: 'delivering',
                },
                {
                    text: 'Cancel',
                    value: 'cancel',
                },
                {
                    text: 'Success',
                    value: 'success',
                },
            ],
            onFilter: (value: any, record: any) => record.orderStatus.indexOf(value) === 0,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => <p>{total}$</p>,
            width: 100,
            sorter: (a: any, b: any) => a.total - b.total,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => {
                return (
                    <div className="flex gap-2">
                        <Button onClick={() => {
                            setUpdateOrderId(record.orderId)
                            setIsModalVisible(true)
                        }}>Update</Button>
                    </div>
                )
            },
            width: 100,
        }

    ]



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
        <>
            <Table
                columns={columns}
                dataSource={listOrder}
                size="small"
                expandable={{
                    expandedRowRender: (record) => {
                        return expandableProduct(record.products)
                    },
                }}
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: '50vw' }}
                loading={isLoadingListOrder}
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
        </>
    )
}