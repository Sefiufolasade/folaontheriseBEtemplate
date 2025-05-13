import React, { useEffect, useState } from 'react'
import { getProduct, getRelated }from '../../../functions/product'
import { useParams } from 'react-router-dom'
import { productStar } from '../../../functions/product'
import SingleProduct from '../../../components/cards/SingleProduct'
import { useSelector } from 'react-redux'
import ProductCard from '../../../components/cards/ProductCard'

const ProductDetails = () => {
    const [loading, setloading] = useState(false)
    const [product, setproduct] = useState([])
    const [related, setrelated] = useState()
    const [star, setstar] = useState()
    const { slug } = useParams()
    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
      loadProduct()
    }, [])

    useEffect(() => {
      // this block of code retains the user rating on refresh by the means of backend
      if(product.ratings && user){
        let existingRatingObject = product.ratings.find((ele) => ele.postedBy.toString() === user._id.toString())
        existingRatingObject && setstar(existingRatingObject.star)//current user rating
      }
    }, [])
    

    const onStarClick = (rate) => {
      const productId = product._id
      const token = user.token
      setstar(rate)
      productStar({productId, rate, token})
      .then((res) => {
        console.log(res.data);
        loadProduct()
      })
    }
    const loadProduct = () => {
      // setloading(true)
      getProduct(slug)
      .then((res) => {
          setproduct(res.data)
          // setloading(false)
          console.log(res.data._id);
          //load related
          getRelated(res.data._id).then(res => setrelated(res.data))
      })
    }

  return (
    <div className='container-fluid'>
      {/* <Breadcrumb separator='>' items={items}/> */}
      <div className='row pt-4'>
        <SingleProduct product={product} onStarClick={onStarClick}/>
      </div>
      <div className='row'>
        <div className='col text-center pt-5 pb-5'>
          <hr/>
            Related Products
          <hr/>
        </div>
      </div>
      <div className='container'>
        <div className='row pb-5'>
          {related && related.length ? related.map((r) => (
              <div key={r._id} className='col-md-3'><ProductCard product={r}/></div>
          )):<div className='text-center'>No related products found</div>}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails