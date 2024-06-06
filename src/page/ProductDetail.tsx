import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {useQuery, useQueryClient} from 'react-query';
import DysonApi from '../axios/DysonApi.ts';
import {toast} from 'react-toastify';
import {useCookies} from 'react-cookie';
import DefaultLayout from "./layout/DefaultLayout";
import {upperCaseFirstLetter} from "../utils";
import {useTranslation} from "react-i18next";
import ListComment from "../compoments/ListComment.tsx";

const listComment = [
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    },
    {
        text: 'Sản phẩm rất tốt',
        time: 1717692565364
    }
]

export default function () {
    const {id} = useParams();
    const [quantity, setQuantity] = useState<number>(1);
    const navigate = useNavigate();
    const [{cart: cartId}] = useCookies(['cart']);
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const {t} = useTranslation()
    const {
        data: product,
        isSuccess
    } = useQuery(['getProductById', id], () => DysonApi.getProductById(id as string), {
            enabled: !!id,
            onSuccess: (data: any) => {
                if (!data) {
                    navigate('/404');
                }
            }
        }
    );

    const handleUpdateQuantity = (type: string) => {
        if (type === 'plus') {
            setQuantity(quantity + 1)
        } else {
            quantity > 1 &&
            setQuantity(quantity - 1)
        }
    }

    const handleAddToCart = async () => {
        try {
            setIsLoading(true)
            const resp = await DysonApi.updateCart(cartId, {
                productId: id,
                quantity,
                type: 'increase'
            })
            if (resp) {
                toast.success(t("Thêm vào giỏ hàng thành công"))
                await queryClient.invalidateQueries('myCartQuantity')
            }
        } catch (error) {
            toast.error(t("Thêm vào giỏ hàng thất bại"))
        } finally {
            setIsLoading(false)
        }
    }

    return isSuccess && (
        <DefaultLayout>
            <div className="single-product-area section-padding-100 clearfix">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mt-50">
                                    <li className="breadcrumb-item"><a href="/">{t("Trang chủ")}</a></li>
                                    <li className="breadcrumb-item">{product?.category}</li>
                                    <li className="breadcrumb-item active" aria-current="page">{(product.name)}</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-7">
                            <div className="single_product_thumb">
                                <div id="product_details_slider" className="carousel slide" data-ride="carousel">
                                    <ol className="carousel-indicators">
                                        {
                                            product.images.map((image: string, index: number) => (
                                                <li
                                                    className={index === currentImageIndex ? "active" : ""}
                                                    data-target="#product_details_slider"
                                                    style={{backgroundImage: `url(${image})`}}
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    data-slide-to={index.toString()}
                                                />
                                            ))
                                        }
                                    </ol>
                                    <div className="carousel-inner">
                                        {
                                            product.images.map((image: string, index: number) => (
                                                <div
                                                    key={index}
                                                    className={
                                                        index === currentImageIndex ?
                                                            "carousel-item active" :
                                                            "carousel-item"
                                                    }
                                                >
                                                    <a className="gallery_img" href={image}>
                                                        <img className="d-block w-100" src={image}
                                                             alt={`Slide ${index}`}/>
                                                    </a>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-5">
                            <div className="single_product_desc">
                                <div className="product-meta-data">
                                    <div className={'d-flex align-items-end'}>
                                        <div>
                                            <div className="line"></div>
                                            <p className="product-price">{product.currentPrice.toLocaleString('vi-VN')}₫</p>
                                        </div>
                                        {
                                            product.discount > 0 && (
                                                <>
                                                    <p className={'mb-1'}
                                                       style={{textDecoration: 'line-through'}}>{product?.price.toLocaleString(
                                                        'vi-VN')}₫</p>
                                                    <p className={'ml-2 text-danger mb-1'}>-{product?.discount}%</p>
                                                </>
                                            )
                                        }
                                    </div>
                                    <a href="#">
                                        <h6>{upperCaseFirstLetter(product.name)}</h6>
                                    </a>
                                    <div
                                        className="ratings-review mb-15 d-flex align-items-center justify-content-between">
                                        <div className="ratings">
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                    <p className="avaibility"><i className="fa fa-circle"></i> {t("Còn hàng")}</p>
                                </div>
                                <div className={'mt-3'}>
                                    <div>
                                        Nhà xuất bản: {product?.productDetail?.publisher}
                                    </div>
                                    <div>
                                        Tác giả: {product?.productDetail?.author}
                                    </div>
                                    <div>
                                        Kích thước: {product?.productDetail?.dimension}
                                    </div>
                                    <div>
                                        Số trang: {product?.productDetail?.totalPage} trang
                                    </div>
                                </div>
                                <div className="short_overview my-5">
                                    <p>{product.description}</p>
                                </div>
                                <div className="cart clearfix">
                                    <div className="cart-btn d-flex mb-50">
                                        <p>{t("Số lượng")}</p>
                                        <div className="quantity">
                                            <span className="qty-minus" onClick={() => handleUpdateQuantity('minus')}><i
                                                className="fa fa-caret-down" aria-hidden="true"></i></span>
                                            <input
                                                type="number"
                                                className="qty-text"
                                                id="qty"
                                                step="1"
                                                min="1"
                                                max="300"
                                                name="quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            />
                                            <span className="qty-plus" onClick={() => handleUpdateQuantity('plus')}><i
                                                className="fa fa-caret-up" aria-hidden="true"></i></span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn amado-btn"
                                        onClick={handleAddToCart}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? t("Đang thêm...") : t("Thêm vào giỏ hàng")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ListComment listComment={listComment}/>
            </div>
        </DefaultLayout>
    )
}
