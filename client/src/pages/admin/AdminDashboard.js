import {React, useState, useEffect } from 'react'
import AdminNav from '../../components/nav/AdminNav'
import  {getProductsByCount} from '../../functions/product'
import AdminProductCard from '../../components/cards/AdminProductCard'

const AdminDashboard = () => {
    const [products, setproducts] = useState([])
    const [loading, setloading] = useState(false)
    useEffect(() => {
        loadAllProducts()

    }, [])

    const loadAllProducts = () => {
        setloading(true)
        getProductsByCount(100)
        .then((res) => {
            setproducts(res.data)
            setloading(false)
        })
        .catch((err) => {
            console.log(err)
            setloading(false)
        })
    }
    
    return(
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-2'>
                <AdminNav/>
            </div>
            <div className='col'>
                <h4>All Products</h4>
                <div className='col'>
                    {products.map((product) => (
                        <div key={product._id}>
                            <AdminProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

)
}

export default AdminDashboard