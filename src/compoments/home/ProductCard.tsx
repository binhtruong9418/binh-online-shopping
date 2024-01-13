import PropTypes, {InferProps} from "prop-types";
import {useNavigate} from "react-router-dom";

export default function ProductCard ({image, price, title, id}: InferProps<typeof ProductCard.propTypes>) {

    const navigate = useNavigate();

    return (
        <div className="single-products-catagory clearfix">
            <a onClick={() => navigate(`/product/${id}`, {
                relative: 'path'
            })}>
                <img src={image} alt="" className="w-100 h-100"/>
                <div className="hover-content">
                    <div className="line"/>
                    <p>From ${price.toFixed(2)}</p>
                    <h4>{title}</h4>
                </div>
            </a>
        </div>
    )
}

ProductCard.propTypes = {
    image: PropTypes.any.isRequired,
    price: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
}


