import { Button, Carousel, Image, Input, InputRef, Popconfirm, Space, Table } from "antd";
import { useRef, useState } from "react";
import { FilterConfirmProps } from "antd/lib/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import DysonApi from "../../axios/DysonApi";
import moment from "moment";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import { toast } from "react-toastify";


export default function ProductTable(): JSX.Element {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [currentEditProduct, setCurrentEditProduct] = useState<any>(null)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(false)

    const {
        data: listProduct = [],
        isLoading: isLoadingListProduct,
        isError: isErrorListProduct,
        refetch
    } = useQuery(['getAllProduct'], () => DysonApi.getAllProduct(), {
        refetchOnWindowFocus: false,
    })


    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: any,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text: string) => {
            const isSearchColumn = searchedColumn === dataIndex;
            if (isSearchColumn) {
                const parts = text.split(new RegExp(`(${searchText})`, 'gi'));
                return <span> {parts.map((part, i) =>
                    searchText && part.toLowerCase() === searchText.toLowerCase() ?
                        <span key={i} style={{ backgroundColor: '#ffc069' }}>{part}</span> :
                        part
                )} </span>;
            } else {
                return <p>{text}</p>
            }
        }
    });

    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await DysonApi.deleteProductById(id)
            if (res) {
                toast.success('Delete product successfully')
                await refetch()
            }
        } catch (error) {
            toast.error('Delete product failed')
        }
    }

    const columns = [
        {
            title: 'Image',
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
                                    <div key={index} style={{ justifyContent: 'center', alignItems: 'center' }}>
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
            title: 'Name',
            dataIndex: 'productName',
            key: 'productName',
            ...getColumnSearchProps('productName'),
            width: 200
        },
        {
            title: 'Description',
            dataIndex: 'productDescription',
            key: 'productDescription',
            width: 150
        },
        {
            title: 'Category',
            dataIndex: 'productCategory',
            key: 'productCategory',
            ...getColumnSearchProps('productCategory'),
            width: 120
        },
        {
            title: 'Price',
            dataIndex: 'productPrice',
            key: 'productPrice',
            render: (productPrice: number) => <p>{productPrice}$</p>,
            sorter: (a: any, b: any) => a.productPrice - b.productPrice,
            width: 100
        },
        {
            title: 'Discount',
            dataIndex: 'productDiscount',
            key: 'productDiscount',
            render: (productDiscount: number) => <p>{productDiscount}%</p>,
            sorter: (a: any, b: any) => a.productDiscount - b.productDiscount,
            width: 100
        },
        {
            title: 'Quantity',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
            render: (productQuantity: number) => <p>{productQuantity}</p>,
            sorter: (a: any, b: any) => a.productQuantity - b.productQuantity,
            width: 100
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => <p>{moment(createdAt).format("DD/MM/YYYY")}</p>,
            sorter: (a: any, b: any) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            width: 120
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div>
                    <Button onClick={() => {
                        setCurrentEditProduct(record)
                        setIsEdit(true)
                    }}>Edit</Button>

                    <Popconfirm title="Sure to delete" onConfirm={() => handleDeleteProduct(record.key).then()}>
                        <Button danger className="mt-3">
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
            width: 100
        }
    ]

    const listProductTable = listProduct.map((product: any) => {
        return {
            key: product._id,
            productImage: product.images,
            productName: product.name,
            productCategory: product.category,
            productDescription: product.description,
            productPrice: product.price,
            productQuantity: product.quantity,
            productDiscount: product.discount,
            createdAt: product.createdAt,
        }
    })

    if (isErrorListProduct) {
        return <div>Error</div>
    }

    return (
        <div>
            <Button type="primary" className="my-3" onClick={() => setIsAdd(true)}>New Product</Button>
            <Table
                columns={columns}
                dataSource={listProductTable}
                pagination={{ pageSize: 15 }}
                bordered
                loading={isLoadingListProduct}
                scroll={{ x: '50vw' }}
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
        </div >
    )
}