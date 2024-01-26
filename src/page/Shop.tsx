import {useQuery} from "react-query";
import DysonApi from "../axios/DysonApi.ts";
import ShopCard from "../compoments/ShopCard.tsx";
import {useState} from "react";
import {Pagination, Slider} from "antd";
import DefaultLayout from "./layout/DefaultLayout.tsx";

const TOTAL_PRODUCT_PER_PAGE = 10;
const SORT_BY = [
    {
        value: '-createdAt',
        label: 'Newest'
    },
    {
        value: 'createdAt',
        label: 'Oldest'
    },
    {
        value: '-currentPrice',
        label: 'Price: High to Low'
    },
    {
        value: 'currentPrice',
        label: 'Price: Low to High'
    }
]
export default function () {
    const [dataSearch, setDataSearch] = useState<any>({
        page: 1,
        limit: TOTAL_PRODUCT_PER_PAGE,
        sort: '-createdAt',
        category: '',
        min: 0,
        max: 100,
    });

    const [priceRange, setPriceRange] = useState<any>([0, 100])
    const [isOpenFilterSort, setIsOpenFilterSort] = useState<boolean>(false);
    const {
        data: listCategory = [],
        isSuccess: isSuccessCategory,
    } = useQuery(['getListCategory'], () => DysonApi.getAllCategory(), {
        refetchOnWindowFocus: true,
        onSuccess: (data: any) => {
            setDataSearch({
                ...dataSearch,
                category: data[0].name,
            })
        }
    })

    const {
        data: listProductData = {},
        isSuccess: isSuccessProduct,
    } = useQuery(
        ['getListProduct', dataSearch],
        ({queryKey}) => DysonApi.getAllProduct(queryKey[1]), {
            refetchOnWindowFocus: true,
        },
    )
    const {items: listProduct = [], count: totalProduct} = listProductData

    const handleChangeCategory = (category: string) => {
        setDataSearch({
            ...dataSearch,
            category,
            page: 1,
        })
    }

    return (
        <DefaultLayout>
            <div className="shop_sidebar_area">
                <div className="widget catagory mb-50">
                    <h6 className="widget-title mb-30">Catagories</h6>
                    <div className="catagories-menu">
                        <ul>
                            {
                                isSuccessCategory && listCategory.map((item: any) => (
                                    <li
                                        key={item._id}
                                        style={{cursor: "pointer"}}
                                        className={dataSearch.category === item.name ? "active" : ""}
                                        onClick={() => handleChangeCategory(item.name)}>
                                        <a>{item.name}</a>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="widget price mb-50">
                    <h6 className="widget-title mb-30">Price</h6>

                    <div className="widget-desc">
                        <div className="slider-range">
                            <Slider
                                range={true}
                                value={priceRange}
                                onChange={(value) => {
                                    setPriceRange(value)
                                }}
                                styles={{
                                    track: {
                                        backgroundColor: '#fbb710',
                                    },
                                    handle: {
                                        backgroundColor: '#fbb710',
                                    },
                                }}
                                onAfterChange={(value) => {
                                    setDataSearch({
                                        ...dataSearch,
                                        min: value[0],
                                        max: value[1],
                                    })
                                }}
                            />
                            <div className="range-price">${dataSearch.min} - ${dataSearch.max}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="amado_product_area section-padding-100">
                <div className="container-fluid">
                    <div className={"row"}>
                        <div className={"col-12"}>
                            <div className={"product-topbar d-xl-flex align-items-center justify-content-between"}>
                                <div className={"total-products"}>
                                    <p>
                                        Showing {" "}
                                        {dataSearch.page * dataSearch.limit - dataSearch.limit + 1} - {dataSearch.page * dataSearch.limit}
                                        {" "}of {totalProduct} result
                                    </p>
                                </div>
                                <div className={"product-sorting d-flex"}>
                                    <div className={"sort-by-date d-flex align-items-center mr-15"} onClick={() => {
                                        setIsOpenFilterSort(!isOpenFilterSort)
                                    }}>
                                        <p>Sort by</p>
                                        <div className={isOpenFilterSort ? "nice-select open" : "nice-select"}>
                                            <span className={"current ml-1"}>
                                                {SORT_BY.find((item: any) => item.value === dataSearch.sort)?.label ?? SORT_BY[0].label}
                                            </span>
                                            <ul className={"list"}>
                                                {
                                                    SORT_BY.map((item: any) => {
                                                        return (
                                                            <li
                                                                key={item?.value}
                                                                onClick={() => {
                                                                    setDataSearch({
                                                                        ...dataSearch,
                                                                        sort: item?.value,
                                                                        page: 1,
                                                                    })
                                                                    setIsOpenFilterSort(false)
                                                                }}
                                                                className={dataSearch?.sort === item?.value ?
                                                                    "option selected focus" :
                                                                    "option"}
                                                            >
                                                                {item?.label}
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {
                            isSuccessProduct && listProduct.map((item: any) => (
                                <ShopCard
                                    key={item._id}
                                    id={item._id}
                                    images={item.images}
                                    name={item.name}
                                    currentPrice={item.currentPrice}
                                />
                            ))
                        }
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="navigation">
                                <ul className="pagination justify-content-end mt-50">
                                    <Pagination
                                        total={totalProduct}
                                        onChange={(page, pageSize) => {
                                            setDataSearch({
                                                ...dataSearch,
                                                page,
                                                limit: pageSize || TOTAL_PRODUCT_PER_PAGE,
                                            })
                                        }}
                                        pageSize={TOTAL_PRODUCT_PER_PAGE}
                                        current={dataSearch.page}
                                    />
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}
