import React,{useState} from 'react'
import {Card, Tabs, Tooltip } from 'antd'
import { Link, useParams } from 'react-router-dom'
import  { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Chair from '../../image/chairNone.jpg'
import ProductItemList from './ProductItemList';
import { Rating } from 'react-simple-star-rating'
import RatingModal from './modal/RatingModal';
import Newrating from '../../functions/rating';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux';

const SingleProduct = ({product, onStarClick}) => {
    const {_id, title, description, images} = product
    const { Meta } = Card
    const { TabPane } = Tabs
    const { slug } = useParams()
    const [rating, setrating] = useState(0)
    const [tooltip, settooltip] = useState("Click to Add")
    const { user, cart } = useSelector((state) => ({...state}))
    const dispatch = useDispatch()

    const handleRating = (rate) => {
        console.log(rate)
        setrating(rate)
        console.log(rating)
    }
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
       <div className='col-md-7'>
            {images && images.length ? <Carousel autoPlay infiniteLoop>
                {images && images.map((image) => <img key={image.public_id} src={image.url}/>)}
            </Carousel>:
            <Card className='defaultCarous'>
                <img src={Chair} />
            </Card>}
            <Tabs type='card'>
                <TabPane tab='Description' key='1'>
                    {description&& description}
                </TabPane>
                <TabPane tab='Contact' key='2'>
                    Contact vendor to confirm product Availability
                </TabPane>
            </Tabs>   
        </div> 
        <div className='col-md-5'>
            <h3 className='bg-info p-3 text-center'>{title}</h3>
            {product && product.ratings && product.ratings.length > 0 ? Newrating(product) :<div className='text-center pt-1 pb-3'>No ratings yet</div>}
            <Card
                actions={[
                    <Tooltip>
                        <p onClick={handleAddToCart}><ShoppingCartOutlined className='text-primary'/><br/> Add to Cart</p>
                    </Tooltip>,
                    <Link to={`/product-details/${slug}`}>
                        <HeartOutlined className='text-info'/><br/>Add To Wishlist
                    </Link>,
                    <RatingModal>
                        <Rating
                            name={_id}
                            onClick={(rate) => onStarClick(rate)}
                        /> 
                    </RatingModal>
                 
                ]}
            >
                <ProductItemList product={product}/>
            </Card>
        </div>
    </>
    
  )
}

export default SingleProduct