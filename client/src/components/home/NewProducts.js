import React, { useEffect, useState } from 'react'
import LoadingCard from '../cards/LoadingCard'
import ProductCard from '../cards/ProductCard';
import { getProducts, getProductsCount } from '../../functions/product';
import { Pagination } from 'antd';

const NewProducts = () => {
    const [products, setproducts] = useState([])
    const [loading, setloading] = useState(false)
    const [productsCount, setproductsCount] = useState(0)
    const [page, setpage] = useState(1)
    useEffect(() => {
      loadProduct()
    }, [page])
    useEffect(() => {
      getProductsCount().then((res) => setproductsCount(res.data))
    }, [])
  
  
    const loadProduct = () => {
      setloading(true)
      getProducts('createdAt', 'desc', page)
      .then((res) => {
        setproducts(res.data)
        setloading(false)
      })
    }
    
  return (
    <div className='container'>
        <div className='text-center'>
          <h5>New Products</h5>
        </div>
        <br/>
        {loading ?
        (<LoadingCard count={4}/>): (
            <div className='row'>
            {products.map((product) => (
                <div key={product._id} className='col-md-3 col-sm-6'>
                    <ProductCard product={product} />
                </div>
            ))}
            </div>
        )  
        }
        <div className='text-center'>
            <Pagination current={page} total={(productsCount/4)*10} onChange={value => setpage(value)}/>
        </div>
    </div>
  )
}

export default NewProducts