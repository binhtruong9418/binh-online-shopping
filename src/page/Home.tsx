import ProductCard from "../compoments/home/ProductCard.tsx";
import { useQuery } from "react-query";
import DysonApi from "../axios/DysonApi.ts";
import { Skeleton } from "antd";
import DefaultLayout from "./layout/DefaultLayout.tsx";

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
            </div>
        </DefaultLayout>
    )
}
