import {React, useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import  {getProductsByCount, removeProduct} from '../../../functions/product'
import AdminProductCard from '../../../components/cards/AdminProductCard'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const AllProducts = () => {
    const [products, setproducts] = useState([])
    const [loading, setloading] = useState(false)
    const { user } = useSelector((state) => ({...state}))
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
    const handleRemove = (slug) => {
        let answer = window.confirm("Delete?")
        if (answer) {
            removeProduct(slug, user.token)
            .then((res) =>{
                loadAllProducts()
                toast.error(`${res.data.title} is deleted`)
            })
            .catch((err) => {
                if (err.response.status === 400) {
                  toast.error(err.response.data)  
                }
            })
        }
    }
    
    return(
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-2'>
                <AdminNav/>
            </div>
            <div className='col'>
                <h4>All Products</h4>
                <div className='row'>
                    {products.map((product) => (
                        <div key={product._id} className='col-md-4 col-sm-6'>
                            <AdminProductCard product={product} handleRemove={handleRemove} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

)
}

export default AllProducts