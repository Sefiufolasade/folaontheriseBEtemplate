import React from 'react'
import { Link } from 'react-router-dom'

const ProductItemList = ({product}) => {
    const {category, subs, price, brand, color, shipping, quantity, sold} = product
  return (
    <ul className='list-group'>
        <li className='d-flex list-group-item justify-content-between'>
            Price{" "}<span className='label label-default label-pill pull-xs-right'>₦{price}</span>
        </li>
        {category && <li className='d-flex list-group-item justify-content-between'>
            Category{" "}<Link to={`/category/${category.slug}`} className='label label-default label-pill pull-xs-right'>{category.name}</Link>
        </li>}
        {subs && <li className='d-flex list-group-item justify-content-between'>
            Sub Category{" "}{subs.map((sub) =><Link to={`/sub/${sub.slug}`} className='label label-default label-pill pull-xs-right'>{sub.name}</Link>)}
        </li>}
        <li className='d-flex list-group-item justify-content-between'>
            Brand{" "}<span className='label label-default label-pill pull-xs-right'>{brand}</span>
        </li>
        <li className='d-flex list-group-item justify-content-between'>
            Color{" "}<span className='label label-default label-pill pull-xs-right'>{color}</span>
        </li>
        <li className='d-flex list-group-item justify-content-between'>
            Shippping{" "}<span className='label label-default label-pill pull-xs-right'>{shipping}</span>
        </li>
        <li className='d-flex list-group-item justify-content-between'>
            Quantity Available{" "}<span className='label label-default label-pill pull-xs-right'>{quantity}</span>
        </li>
        <li className='d-flex list-group-item justify-content-between'>
            Quantity Sold{" "}<span className='label label-default label-pill pull-xs-right'>{sold}</span>
        </li>
    </ul>
  )
}

export default ProductItemList