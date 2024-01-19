import PropTypes, {InferProps} from "prop-types";
import {useNavigate} from "react-router-dom";
import {upperCaseFirstLetter} from "../../utils";

export default function ProductCard({item}: InferProps<typeof ProductCard.propTypes>) {

    const navigate = useNavigate();

    return (
        <div className="single-products-catagory clearfix">
            <a onClick={() => navigate(`/product/${item?.id}`, {
                relative: 'path'
            })}>
                <img src={item?.image} alt="" className="w-100 h-100"/>
                <div className="hover-content">
                    <div className="line"/>
                    <div className={'d-flex gap-2 align-items-center'}>
                        <h5 className={'mr-3 font-bold text-lg'}>
                            From ${item?.currentPrice.toFixed(2)}
                        </h5>
                        {
                            item?.discount > 0 && (
                                <>
                                    <p className={'text-decoration-line-through'}>${item?.price.toFixed(2)}</p>
                                    <p className={'ml-2 text-danger'}>-{item?.discount}%</p>
                                </>
                            )
                        }
                    </div>
                    <h5>{upperCaseFirstLetter(item?.name)}</h5>
                </div>
            </a>
        </div>
    )
}

ProductCard.propTypes = {
    item: PropTypes.any.isRequired
}


