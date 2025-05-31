import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCategories, removeCategory, createCategory} from '../../../functions/category'
import {toast} from 'react-toastify'
import AdminNav from '../../../components/nav/AdminNav'
import {Link} from 'react-router-dom'
import { EditOutlined, DeleteOutlined} from '@ant-design/icons'

const CategoryCreate = () => {
    const { user } = useSelector((state) => ({...state}))

    const [name, setName] = useState("")
    const [loading, setloading] = useState(false)
    const [categories, setcategories] = useState([])
    const [keyword, setkeyword] = useState('')

    useEffect(() => {
      loadCategories()
    }, [])
    
    const loadCategories = () => {
        getCategories().then((c) => setcategories(c.data))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setloading(true)
        createCategory({name}, user.token)
        .then(res => {
            setloading(false);
            setName('')
            toast.success(`${res.data.name} category created`)
            loadCategories()
        })
        .catch(err =>{
            // console.log(err);
            setloading(false);
            if(err.response.status === 400){
                toast.error(err.response.data)
            }
        })

    }

    const handleRemove = async(slug) => {
        let answer = window.confirm('Delete?')
        if(answer){
            setloading(true)
            removeCategory(slug, user.token)
            .then(() => {
                setloading(false)
                toast.success('Category Removed')
                loadCategories()
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    setloading(false)
                    toast.error(err.response.data)
                }

            })
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setkeyword(e.target.value.toLowerCase())
    }

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

    const categoryForm = () => <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <br/>
            <label>Name</label>
            <input type='text' className='form-control' onChange={(e) => setName(e.target.value)} value={name} autoFocus required/>
            {loading?  <button className='btn btn-outlined-primary' disabled>Loading...</button>:<button className='btn btn-outlined-primary'>Save</button>}
        </div>
    </form>
  return(
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-3 col-sm-4'>
                <AdminNav/>
            </div>
            <div className='col'>
                {categoryForm()}
                <input type='text' className='form-control' onChange={handleSearch} value={keyword} placeholder='Search here'/>
                <hr/>
                <h3>Categories List.</h3>
                {categories.filter(searched(keyword)).map((c) => (
                    <div className='alert alert-secondary category' key={c._id}>{c.name} {" "} <span className='btn btn-sm options text-danger' onClick={() => handleRemove(c.slug)}><DeleteOutlined className='icon'/>delete</span> {" "} <Link className='btn btn-sm options text-primary' to={`/admin/category/${c.slug}`} ><EditOutlined className='icon'/> Edit</Link></div>
                ))}
            </div>
        </div>
    </div>

)
}

export default CategoryCreate