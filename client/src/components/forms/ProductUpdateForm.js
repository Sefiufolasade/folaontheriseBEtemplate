import React from 'react'
import FileUpload from './FileUpload'
import { Select } from 'antd'

const ProductUpdateForm = ({showSub, subOptions, handleSubmit, values, handleChange, handleCategoryChange, setloading}) => {
    const { Option } = Select
    const {title, description, price, categories, category, subs, shipping, quantity, images, colors, color, brand } = values
  return (
    <form onSubmit={handleSubmit}>
        <FileUpload values={values} setloading={setloading}/>
        <div className='form-group'>
            <label>Title</label>
            <input type='text' name='title' className='form-control' onChange={handleChange} value={title}/>
        </div>
        <br/>
        <div className='form-group'>
            <label>Description</label>
            <input type='text' name='description' className='form-control' onChange={handleChange} value={values.description}/>
        </div>
        <br/>
        <div className='form-group'>
            <label>Price</label>
            <input type='number' min={0} name='price' className='form-control' onChange={handleChange} value={price}/>
        </div>
        <br/>
        <div className='form-group'>
            <label>Shipping</label>
            <select value={shipping === "Yes" ? "Yes" : "No"} name='shipping' className='form-control' onChange={handleChange}>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
            </select>
        </div>
        <br/>
        <div className='form-group'>
            <label>Quantity</label>
            <input type='number' min={0} name='quantity' className='form-control' onChange={handleChange} value={quantity}/>
        </div>
        <br/>
        <div className='form-group'>
            <label>Color</label>
            <select value={color} name='color' className='form-control' onChange={handleChange}>
                <option>Please Select</option>
                {colors.map((c) =><option value={c}>{c}</option>)}
            </select>
        </div>
        <br/>
        <div className='form-group'>
            <label>Brand</label>
            <input type='text' name='brand' className='form-control' onChange={handleChange} value={brand}/>
        </div>
        <br/>
        <div className='form-group'>
            <label>Category</label>
            <select className='form-control' name='category' onChange={handleCategoryChange} >
                <option value={''}>Please Select a Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
        </div>
        <br/>
        {showSub &&<div className='form-group'>
            <label>Sub Categories</label>
            <Select mode='multiple' className='form-control seLect' placeholder='Please Select' value={subs} onChange={handleChange}>
                {subOptions.length && subOptions.map((s) => (
                <Option key={s._id} value={s._id}>
                    {s.name}
                </Option>))}
            </Select>
        </div>}
        <button className='btn btn-info'>Save</button>
    </form>
  )
}

export default ProductUpdateForm