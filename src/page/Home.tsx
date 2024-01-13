import ProductCard from "../compoments/home/ProductCard.tsx";
import { useQuery } from "react-query";
import DysonApi from "../axios/DysonApi.tsx";
import { Skeleton } from "antd";
import DefaultLayout from "./layout/DefaultLayout.tsx";

export default function () {
    const { data: newProduct, isSuccess: getNewProductSs, isLoading } = useQuery(
        ["airDropApi.getNewProduct"],
        () => DysonApi.getNewProduct(),
        {
            refetchOnWindowFocus: "always",
        })

    if (isLoading) return (<Skeleton />)

    return (
        <DefaultLayout>
            <div className="products-catagories-area clearfix">
                <div className="amado-pro-catagory clearfix row">
                    {
                        getNewProductSs && newProduct.map((e: any) => (
                            <ProductCard title={e.name} price={e.currentPrice} image={e.images[0]} key={e._id} id={e._id} />
                        ))
                    }
                </div>
            </div>
        </DefaultLayout>
    )
}
