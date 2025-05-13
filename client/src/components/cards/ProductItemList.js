import React from 'react'
import { Link } from 'react-router-dom'

const ProductItemList = ({product}) => {
    const {category, subs, price, brand, color, shipping, quantity, sold} = product
  return (
    <ul className='list-group'>
        <li className='list-group-item'>
            Price{" "}<span className='label label-default label-pill pull-xs-right'>₦{price}</span>
        </li>
        {category && <li className='list-group-item'>
            Category{" "}<Link to={`/category/${category.slug}`} className='label label-default label-pill pull-xs-right'>{category.name}</Link>
        </li>}
        {subs && <li className='list-group-item'>
            Sub Category{" "}{subs.map((sub) =><Link to={`/sub/${sub.slug}`} className='label label-default label-pill pull-xs-right'>{sub.name}</Link>)}
        </li>}
        <li className='list-group-item'>
            Brand{" "}<span className='label label-default label-pill pull-xs-right'>{brand}</span>
        </li>
        <li className='list-group-item'>
            Color{" "}<span className='label label-default label-pill pull-xs-right'>{color}</span>
        </li>
        <li className='list-group-item'>
            Shippping{" "}<span className='label label-default label-pill pull-xs-right'>{shipping}</span>
        </li>
        <li className='list-group-item'>
            Quantity Available{" "}<span className='label label-default label-pill pull-xs-right'>{quantity}</span>
        </li>
        <li className='list-group-item'>
            Quantity Sold{" "}<span className='label label-default label-pill pull-xs-right'>{sold}</span>
        </li>
    </ul>
  )
}

export default ProductItemList