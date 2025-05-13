import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
const Cart = () => {
    const {user, cart} = useSelector((state) => ({...state}))
    const dispatch = useDispatch()

    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + (nextValue.count * nextValue.price)
        }, 0)
    }

  return (
    <>
        <div className="container-fluid pt-3">
            <div className='row'>
                <h3>Cart/ {cart.length} Products</h3>
            </div>
            <div className='row'>
                <div className='col-md-8' >
                    {!cart.length ? 
                        <h4>No products in cart <Link to='/shop'>Continue Shopping</Link></h4>:
                        cart.map((c,i) =>
                            <>
                                <div key={c._id}>
                                    <img src={c.images[0].url} style={{width: '100px', height:'100px'}}/> - {c.title} - {c.price} - {c.color} - <Link to={`/product-details/${c.slug}`}>View Product</Link> - <a>Remove Product </a>
                                </div>
                                <br/>
                            </>
                        )
                    }
                </div>
                <div className='col-md-4'>
                    {cart.length &&
                        <>
                            <h4>Order Summary</h4>
                            <hr/>
                            {cart.map((c) =>
                                <>
                                    <div key={c._id}>
                                        {c.title} - ₦{c.price} x {c.count} = ₦{c.price*c.count}
                                    </div>
                                    <br/>
                                </>
                            )}
                            <hr/>
                            Total: <b>₦{getTotal()}</b>
                            <hr/>
                            {
                                user?
                                <Link>Procced to Checkout</Link>:
                                <Link to={'/login'}>Login to Checkout</Link>
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    </>  
  )
}

export default Cart