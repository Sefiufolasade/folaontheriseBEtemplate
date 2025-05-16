import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getSubs, removeSub, createSub } from '../../../functions/sub'
import { getCategories } from '../../../functions/category'
import {toast} from 'react-toastify'
import AdminNav from '../../../components/nav/AdminNav'
import {Link} from 'react-router-dom'
import { EditOutlined, DeleteOutlined} from '@ant-design/icons'

const CreateSub = () => {
    const { user } = useSelector((state) => ({...state}))

    const [name, setName] = useState("")
    const [loading, setloading] = useState(false)
    const [subs, setsubs] = useState([])
    const [categories, setcategories] = useState([])
    const [category, setcategory] = useState('')
    const [keyword, setkeyword] = useState('')

    useEffect(() => {
      loadSubs()
    }, [])
    
    const loadSubs = () => {
        getSubs().then((c) => setsubs(c.data))
        getCategories().then((c) => setcategories(c.data))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setloading(true)
        createSub({name, parent: category}, user.token)
        .then(res => {
            setloading(false);
            setName('')
            setcategory('')
            toast.success(`${res.data.name} category created`)
            loadSubs()
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
            removeSub(slug, user.token)
            .then(() => {
                setloading(false)
                toast.success('Category Removed')
                loadSubs()
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

    const subForm = () => <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <br/>
            <label>Category</label>
            <select className='form-control' name='category' onChange={((e) => setcategory(e.target.value))} >
                {category === '' && <option value={''}>Please Select a Category</option>}
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <br/>
            <label>Sub-Category Name</label>
            <input type='text' className='form-control' onChange={(e) => setName(e.target.value)} value={name} autoFocus required/>
            {loading?  <button className='btn btn-outlined-primary' disabled>Loading...</button>:<button className='btn btn-outlined-primary'>Save</button>}
        </div>
    </form>
  return(
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-2'>
                <AdminNav/>
            </div>
            <div className='col'>
                {subForm()}
                <br/>
                <label>Filter</label>
                <input type='text' className='form-control' onChange={handleSearch} value={keyword} placeholder='Search here'/>
                <hr/>
                <h3>Sub-Categories List.</h3>
                {subs.filter(searched(keyword)).map((c) => (
                    <div className='alert alert-secondary category' key={c._id}>{c.name} {" "} <span className='btn btn-sm options text-danger' onClick={() => handleRemove(c.slug)}><DeleteOutlined className='icon'/>delete</span> {" "} <Link className='btn btn-sm options text-primary' to={`/admin/sub/${c.slug}`} ><EditOutlined className='icon'/> Edit</Link></div>
                ))} 
            </div>
        </div>
    </div>

)
}

export default CreateSub