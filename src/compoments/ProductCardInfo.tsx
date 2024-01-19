import PropTypes, { InferProps } from 'prop-types';
import { useEffect, useState } from 'react';

export default function ProductCardInfo({ id, name, price, image, quantity, handleChangeQuantity }: InferProps<typeof ProductCardInfo.propTypes>): JSX.Element {
    const [currentQuantity, setCurrentQuantity] = useState<number>(quantity)
    useEffect(() => {
        setCurrentQuantity(quantity)
    }, [quantity])
    return (
        <tr>
            <td className="cart_product_img">
                <a href="#"><img src={image} alt="Product" /></a>
            </td>
            <td className="cart_product_desc">
                <h5>{name}</h5>
            </td>
            <td className="price">
                <span>${price.toFixed(2)}</span>
            </td>
            <td className="qty">
                <div className="qty-btn d-flex">
                    <p>Qty</p>
                    <div className="quantity">
                        <span className="qty-minus" onClick={() => handleChangeQuantity(id, 1, 'decrease').then()}><i className="fa fa-minus" aria-hidden="true"></i></span>
                        <input
                            type="number"
                            className="qty-text"
                            id="qty"
                            step={1}
                            min={0}
                            name="quantity"
                            value={currentQuantity}
                            onChange={(e) => setCurrentQuantity(e.target.valueAsNumber)}
                            onBlur={(e) => {
                                const value = e.target.valueAsNumber
                                handleChangeQuantity(
                                    id,
                                    Math.abs(value - quantity),
                                    value - quantity > 0 ? 'increase' : 'decrease'
                                ).then()
                            }
                            }
                        />
                        <span className="qty-plus" onClick={() => handleChangeQuantity(id, 1, 'increase').then()}><i className="fa fa-plus" aria-hidden="true"></i></span>
                    </div>
                </div>
            </td>
        </tr>
    )
}

ProductCardInfo.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    handleChangeQuantity: PropTypes.func.isRequired,
}
