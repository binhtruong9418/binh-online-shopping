import PropTypes, {InferProps} from "prop-types";
import {Link} from "react-router-dom";
import {upperCaseFirstLetter} from "../../utils";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export default function ProductCard({item}: InferProps<typeof ProductCard.propTypes>) {
    const {t} = useTranslation();
    const [isHover, setIsHover] = useState(false);
    return (
        <div className="single-products-catagory clearfix"
             onMouseEnter={() => setIsHover(true)}
             onMouseLeave={() => setIsHover(false)}
        >
            <Link to={`/product/${item?.id}`}>
                <div>
                    <img src={item?.image} alt="" className="w-100 h-100"/>
                    {
                        isHover && (
                            <div className="hover-content display-on-hover">
                                <div className="line"/>
                                <div className={'d-flex gap-2 align-items-center'}>
                                    <h5 className={'mr-3 font-bold text-lg'} style={{color: '#fff'}}>
                                        {t("Từ")} {item?.currentPrice.toLocaleString("vi-VN")}₫
                                    </h5>
                                    {
                                        item?.discount > 0 && (
                                            <>
                                                <p className={'text-decoration-line-through'}>{item?.price.toLocaleString("vi-VN")}₫</p>
                                                <p className={'ml-2 text-danger'}>-{item?.discount}%</p>
                                            </>
                                        )
                                    }
                                </div>
                                <h5 style={{color: '#fff'}}>{upperCaseFirstLetter(item?.name)}</h5>
                            </div>
                        )
                    }
                </div>
            </Link>
        </div>
    )
}

ProductCard.propTypes = {
    item: PropTypes.any.isRequired
}


