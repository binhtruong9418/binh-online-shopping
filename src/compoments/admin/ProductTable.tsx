import {Button, Carousel, Image, Input, Pagination, Popconfirm, Select, Space, Table} from "antd";
import {useState} from "react";
import {useQuery} from "react-query";
import DysonApi from "../../axios/DysonApi.ts";
import moment from "moment";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import {toast} from "react-toastify";
import {BiPencil, BiTrash} from "react-icons/bi";


export default function ProductTable(): JSX.Element {
    const [currentEditProduct, setCurrentEditProduct] = useState<any>(null)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [dataSearch, setDataSearch] = useState<any>({
        page: 1,
        limit: 10,
        sort: '-createdAt',
        category: undefined,
        name: ""
    });

    const {
        data: listCategory = []
    } = useQuery('getAllCategory',async () => {
        return await DysonApi.getAllCategory()
    })

    const {
        data: listProductData = {},
        isLoading: isLoadingListProduct,
        isError: isErrorListProduct,
        refetch
    } = useQuery(['getAllProduct', dataSearch], ({queryKey}) => DysonApi.getAllProduct(queryKey[1]), {
        refetchOnWindowFocus: false,
    })

    const {items: listProduct = [], count: totalProduct} = listProductData


    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await DysonApi.deleteProductById(id)
            if (res) {
                toast.success('Xóa sách thành công!')
                await refetch()
            }
        } catch (error) {
            toast.error('Xóa sách thất bại')
        }
    }

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'productImage',
            key: 'productImage',
            render: (productImage: string[]) => {
                return (
                    <Space
                        direction="vertical"
                        style={{
                            width: "100px",
                        }}
                        size="middle">
                        <Carousel dotPosition="bottom">
                            {
                                productImage.map((x, index) => (
                                    <div key={index} style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Image
                                            src={x}
                                            preview={true}
                                        />
                                    </div>
                                ))
                            }
                        </Carousel>
                    </Space>
                )
            },
            width: 120
        },
        {
            title: 'Tên sách',
            dataIndex: 'productName',
            key: 'productName',
            width: 200
        },
        {
            title: 'Miêu tả',
            dataIndex: 'productDescription',
            key: 'productDescription',
            width: 100,
            render: (description: string) => {
                const shortenDesription = description.length > 100
                    ? description.substring(0, 100) + ' ...' : description
                return (
                    <div>
                        {shortenDesription}
                    </div>
                )
            }
        },
        {
            title: 'Danh mục',
            dataIndex: 'productCategory',
            key: 'productCategory',
            width: 120
        },
        {
            title: 'Thông tin sách',
            key: 'productDetail',
            dataIndex: 'productDetail',
            render: (productDetail: any) => (
                <div>
                    <p>Tác giả: {productDetail?.author}</p>
                    <p>NXB: {productDetail?.publisher}</p>
                    <p>Kích thước: {productDetail?.dimension}</p>
                    <p>Số trang: {productDetail?.totalPage}</p>
                </div>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'productPrice',
            key: 'productPrice',
            render: (productPrice: number) => <p>{productPrice?.toLocaleString('vi-VN')}₫</p>,
            width: 100
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'productDiscount',
            key: 'productDiscount',
            render: (productDiscount: number) => <p>{productDiscount}%</p>,
            width: 100
        },
        {
            title: 'Số lượng',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
            render: (productQuantity: number) => <p>{productQuantity}</p>,
            width: 100
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => <p>{moment(createdAt).format("DD/MM/YYYY")}</p>,
            width: 120
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (

                <Space>
                    <Button
                        type="text"
                        onClick={() => {
                            setCurrentEditProduct(record)
                            setIsEdit(true)
                        }}
                    >
                        <BiPencil/>
                    </Button>
                    <Popconfirm title="Sure to delete" onConfirm={() => handleDeleteProduct(record.key).then()}>
                        <Button type="text" danger>
                            <BiTrash/>
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: 100
        }
    ]

    const tableData = listProduct.map((product: any) => {
        return {
            key: product?._id,
            productImage: product?.images,
            productName: product?.name,
            productCategory: product?.category,
            productDescription: product?.description,
            productPrice: product?.price,
            productQuantity: product?.quantity,
            productDiscount: product?.discount,
            createdAt: product?.createdAt,
            productDetail: product?.productDetail
        }
    })

    if (isErrorListProduct) {
        return <div>Error</div>
    }

    return (
        <div>
            <Button type="primary" className="my-3 ml-3" onClick={() => setIsAdd(true)}>
                Thêm sách
            </Button>
            <div className={'ml-3 mb-4'}>
                <Space>
                    <Input
                        placeholder="Tìm theo tên"
                        onChange={(e) => {
                            setDataSearch({
                                ...dataSearch,
                                name: e.target.value,
                            })
                        }}
                        style={{width: '300px'}}
                    />
                    <Select
                        placeholder="Tìm theo danh mục"
                        style={{width: '200px'}}
                        onChange={(value) => {
                            setDataSearch({
                                ...dataSearch,
                                category: value,
                            })
                        }}
                        value={dataSearch.category}
                    >
                        <Select.Option value={undefined}>Tất cả</Select.Option>
                        {
                            listCategory.map((category: any) => (
                                <Select.Option key={category._id} value={category.name}>{category.name}</Select.Option>
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
                        <Select.Option value={'-createdAt'}>Mới nhất</Select.Option>
                        <Select.Option value={'createdAt'}>Cũ nhất</Select.Option>
                        <Select.Option value={'-currentPrice'}>Giá: cao đến thấp</Select.Option>
                        <Select.Option value={'currentPrice'}>Giá: thấp đến cao</Select.Option>
                    </Select>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                bordered
                loading={isLoadingListProduct}
                scroll={{x: '50vw'}}
            />
            <Pagination
                total={totalProduct}
                onChange={(page, pageSize) => {
                    setDataSearch({
                        ...dataSearch,
                        page,
                        limit: pageSize || 10,
                    })
                }}
                current={dataSearch.page}
                pageSize={dataSearch.limit}
                style={{textAlign: 'right', marginTop: 10}}
            />
            {
                isEdit && currentEditProduct &&
                <EditProductModal
                    isVisible={isEdit}
                    setIsVisible={setIsEdit}
                    name={currentEditProduct.productName}
                    description={currentEditProduct.productDescription}
                    category={currentEditProduct.productCategory}
                    price={currentEditProduct.productPrice}
                    quantity={currentEditProduct.productQuantity}
                    images={currentEditProduct.productImage}
                    id={currentEditProduct.key}
                    discount={currentEditProduct.productDiscount}
                    author={currentEditProduct.productDetail.author}
                    publisher={currentEditProduct.productDetail.publisher}
                    totalPage={currentEditProduct.productDetail.totalPage}
                    dimension={currentEditProduct.productDetail.dimension}
                    refetchProduct={refetch}
                />
            }
            {
                isAdd &&
                <AddProductModal
                    isVisible={isAdd}
                    setIsVisible={setIsAdd}
                    refetchProduct={refetch}
                />
            }
        </div>
    )
}