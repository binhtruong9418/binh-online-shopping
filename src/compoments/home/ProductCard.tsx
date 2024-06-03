import PropTypes, {InferProps} from "prop-types";
import {Link} from "react-router-dom";
import {upperCaseFirstLetter} from "../../utils";
import {useTranslation} from "react-i18next";

export default function ProductCard({item}: InferProps<typeof ProductCard.propTypes>) {
    const {t} = useTranslation();

    return (
        <div className="single-products-catagory clearfix">
            <Link to={`/product/${item?.id}`}>
                <>
                    <img src={item?.image} alt="" className="w-100 h-100"/>
                    <div className="hover-content">
                        <div className="line"/>
                        <div className={'d-flex gap-2 align-items-center'}>
                            <h5 className={'mr-3 font-bold text-lg'}>
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
                        <h5>{upperCaseFirstLetter(item?.name)}</h5>
                    </div>
                </>
            </Link>
        </div>
    )
}

ProductCard.propTypes = {
    item: PropTypes.any.isRequired
}


