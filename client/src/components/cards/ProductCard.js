import React, {useState} from 'react'
import { Card, Tooltip } from 'antd'
import { Link } from 'react-router-dom';
import { EyeOutlined, ShoppingCartOutlined} from '@ant-design/icons'
import Newrating from '../../functions/rating';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux';

const ProductCard = ({product}) => {
    const { Meta } = Card
    const {title, description, images, slug} = product
    const [tooltip, settooltip] = useState("Click to Add")
    const { user, cart } = useSelector((state) => ({...state}))
    const dispatch = useDispatch()

    const handleAddToCart = () => {
        let cart = []
        if(typeof window !== "undefined") {
            //if cart is in local storage
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.push({
                ...product,
                count: 1,
            })
        }
        let unique = _.uniqWith(cart, _.isEqual)

        localStorage.setItem("cart", JSON.stringify(unique))
        settooltip("Added")

        dispatch({
            type: "ADD_TO_CART",
            payload: unique,
        })
    }
  return (
    <>
        {product && product.ratings && product.ratings.length > 0 ? (Newrating(product)):<div className='d-flex pt-1 justify-content-center mb-0'><p>No ratings yet</p></div>}
        <Card
            hoverable
            style={{
            width: 200,
            marginBottom: 10,
            marginTop: 0,
            }}
            className='p-1 mt-0'
            cover={<img alt="example" style={{height: 150}}src={images && images.length ? images[0].url:"https://res.cloudinary.com/dvdy3c2af/image/upload/v1748417009/Innterior_qtmjp7.png"} />}
            actions={[
                <Link to={`/product-details/${slug}`}>
                    <EyeOutlined className='text-success'/><br/>View Details
                </Link>,
                <Tooltip>
                    <a onClick={handleAddToCart}><ShoppingCartOutlined className='text-primary'/><br/> Add to Cart</a>
                </Tooltip>
            ]}
        >
            <Meta title={title} description={`${description && description.substring(0,25)}...`} />
        </Card>
    </>
        
  )
}

export default ProductCard