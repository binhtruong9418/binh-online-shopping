import { useQuery, useQueryClient } from "react-query";
import ProductCardInfo from "../compoments/ProductCardInfo.tsx";
import { useCookies } from "react-cookie";
import DysonApi from "../axios/DysonApi.tsx";
import { Skeleton } from "antd";
import { toast } from "react-toastify";
import { useState } from "react";
import DefaultLayout from "./layout/DefaultLayout.tsx";

export default function () {
    const [cookies] = useCookies(['cart']);
    const [listProduct, setListProduct] = useState<any[]>([])
    const queryClient = useQueryClient();
    const {
        data: { totalAmount } = {},
        isLoading,
        refetch,
    } = useQuery(['myCart'], async () => {
        const res = await DysonApi.getCart(cookies.cart);
        const listData = await Promise.all(res.products.map(async (e: any) => {
            const product = await DysonApi.getProductById(e.productId);
            return {
                ...product,
                quantity: e.quantity
            }
        }))

        const totalAmount = listData.reduce((acc: number, cur: any) => acc + cur.currentPrice * cur.quantity, 0)
        setListProduct(listData)
        return {
            totalAmount
        }
    }, {
        enabled: !!cookies.cart
    })

    const handleChangeQuantity = async (productId: string, quantity: number, type: string) => {
        try {
            await DysonApi.updateCart(cookies.cart, {
                productId,
                quantity,
                type
            })
            await refetch()
            await queryClient.invalidateQueries('myCartQuantity')
        } catch (error: any) {
            toast.error(error.message)
        }
    }
    return (
        <DefaultLayout>
            <div className="cart-table-area section-padding-100">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-lg-8">
                            <div className="cart-title mt-50">
                                <h2>Shopping Cart</h2>
                            </div>

                            <div className="cart-table clearfix">
                                <table className="table table-responsive">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            isLoading ?
                                                <tr>
                                                    <Skeleton />
                                                </tr>
                                                : listProduct && listProduct.map((e: any) => (
                                                    <ProductCardInfo
                                                        key={e._id}
                                                        id={e._id}
                                                        name={e.name}
                                                        price={e.currentPrice}
                                                        quantity={e.quantity}
                                                        image={e.images[0]}
                                                        handleChangeQuantity={handleChangeQuantity}
                                                    />
                                                ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="cart-summary">
                                <h5>Cart Total</h5>
                                <ul className="summary-table">
                                    <li><span>subtotal:</span> <span>${totalAmount?.toFixed(2)}</span></li>
                                    <li><span>delivery:</span> <span>Free</span></li>
                                    <li><span>total:</span> <span>${totalAmount?.toFixed(2)}</span></li>
                                </ul>
                                <div className="cart-btn mt-100">
                                    <a href="/checkout" className="btn amado-btn w-100">Checkout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}
