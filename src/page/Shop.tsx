import { useQuery } from "react-query";
import DysonApi from "../axios/DysonApi.tsx";
import ShopCard from "../compoments/ShopCard.tsx";
import { useState } from "react";
import { Skeleton } from "antd";
import DefaultLayout from "./layout/DefaultLayout.tsx";

export default function () {
    const TOTAL_PRODUCT_PER_PAGE = 2;
    const [currentTab, setCurrentTab] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [listPageProduct, setListPageProduct] = useState<any[]>([]);

    const {
        data: listCategory = [],
        isLoading: isLoadingCategory,
        isSuccess: isSuccessCategory,
    } = useQuery(['getListCategory'], () => DysonApi.getAllCategory(), {
        refetchOnWindowFocus: false,
        onSuccess: (data: any) => {
            setCurrentTab(data[0]?.name)
            setCurrentPage(0)
        }
    })

    const {
        data: listProduct = [],
        isLoading: isLoadingProduct,
        isSuccess: isSuccessProduct,
    } = useQuery(['getListProduct', currentTab], ({ queryKey }) => DysonApi.getAllProductByCategory(queryKey[1]), {
        refetchOnWindowFocus: false,
        enabled: !!currentTab,
        onSuccess: (data: any) => {
            setListPageProduct(data.slice(0, TOTAL_PRODUCT_PER_PAGE))
         }
    },
        )
    
    const handleChangePage = (page: number) => { 
        setCurrentPage(page)
        setListPageProduct(listProduct.slice(page * TOTAL_PRODUCT_PER_PAGE, (page + 1) * TOTAL_PRODUCT_PER_PAGE))
    }

    const handleChangeCategory = (category: string) => { 
        setCurrentTab(category)
        setCurrentPage(0)
    }

    if (isLoadingCategory || isLoadingProduct) return (<Skeleton active />)


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
                                        style={{ cursor: "pointer" }}
                                        className={currentTab === item.name ? "active" : ""}
                                        onClick={() => handleChangeCategory(item.name)}>
                                        <a href="#">{item.name}</a>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="amado_product_area section-padding-100">
                <div className="container-fluid">
                    <div className="row">
                        {
                            isSuccessProduct && listPageProduct.map((item: any) => (
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
                                    {
                                        Array.from(Array(Math.ceil(listProduct.length / TOTAL_PRODUCT_PER_PAGE)).keys()).map((item: any) => (
                                            <li
                                                key={item}
                                                className={currentPage === item ? "page-item active" : "page-item"}
                                                onClick={() => handleChangePage(item)}>
                                                <a className="page-link" href="#">{item + 1}.</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}
