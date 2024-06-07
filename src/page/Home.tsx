import ProductCard from "../compoments/home/ProductCard.tsx";
import { useQuery } from "react-query";
import DysonApi from "../axios/DysonApi.ts";
import { Skeleton } from "antd";
import DefaultLayout from "./layout/DefaultLayout.tsx";
import {Link} from "react-router-dom";

export default function () {
    const { data: newProductData = {}, isSuccess: getNewProductSs, isLoading } = useQuery(
        ["getNewProduct"],
        () => DysonApi.getAllProduct({
            limit: 20,
            page: 1,
            sort: "-createdAt",
        }),
        {
            refetchOnWindowFocus: "always",
        })
    const { items: listNewProduct = []} = newProductData

    if (isLoading) return (<Skeleton />)

    return (
        <DefaultLayout>
            <div className="products-catagories-area clearfix">
                <div className="amado-pro-catagory clearfix row">
                    {
                        getNewProductSs && listNewProduct.map((e: any) => (
                            <ProductCard
                                key={e._id}
                                item={{
                                ...e,
                                id: e._id,
                                image: e.images[0],
                            }}/>
                        ))
                    }
                </div>
                {
                    listNewProduct && listNewProduct.length > 20 && (
                        <Link to={'/shop'}>
                            <div className={'text-center mt-4 mb-3 text-center'} style={{fontSize: 16}}>
                                Xem tất cả sản phẩm
                            </div>
                        </Link>
                    )
                }
            </div>
        </DefaultLayout>
    )
}
