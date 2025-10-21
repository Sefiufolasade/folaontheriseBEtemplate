import React, { useEffect, useState } from 'react'
import { getCategories} from '../../../functions/category'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categories, setcategories] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        setloading(true)
      getCategories().then((c) => {
        setcategories(c.data)
        setloading(false)
      })
    }, [])
    
    const showCategories = () => categories.length > 0 && categories.map((c) => <div className='col btn text-primary btn-outlined-primary btn-raised btn-lg btn-block m-2'><Link to={`/category/${c.slug}`}>{c.name}</Link></div>)

  return (
    <div className='container'>
        <div className='row'>
            <div className='text-center pt-5'>
                <h5>Categories</h5>
            </div>
            {loading ? (<h4 className='text-center'> Loading...</h4>): showCategories()}
        </div>
    </div>
  )
}

export default CategoryList