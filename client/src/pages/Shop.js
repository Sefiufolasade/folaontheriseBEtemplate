import React, { useEffect, useState } from 'react'
import { fetchProductByFilter, getProductsByCount } from '../functions/product'
import { useSelector, useDispatch } from 'react-redux'
import { getCategories } from '../functions/category'
import { getSubs } from '../functions/sub'
import ProductCard from '../components/cards/ProductCard'
import { Menu, Slider, Checkbox, Radio } from 'antd'
import SubMenu from 'antd/es/menu/SubMenu'
import {DollarOutlined, DownSquareOutlined, StarOutlined, CarOutlined, FormatPainterOutlined} from '@ant-design/icons'
import Star from '../components/forms/Star'

const Shop = () => {
    const [products, setproducts] = useState([])
    const [loading, setloading] = useState(false)
    const [price, setprice] = useState([0,0])
    const [ok, setok] = useState(false)
    const [categories, setcategories] = useState([])
    const [subs, setsubs] = useState([])
    const [brands, setbrands] = useState(['Corella', 'Shimsu', 'Samsung'])
    const [brand, setbrand] = useState('')
    const [colors, setcolors] = useState(['Red','Green','Orange','Grey','Blue','white'])
    const [color, setcolor] = useState('')
    const [sub, setsub] = useState('')
    const [shipping, setshipping] = useState('')
    const [categoryIds, setcategoryIds] = useState([])
    // const [star, setstar] = useState('')

    let dispatch = useDispatch()
    let { search } = useSelector((state) => ({...state}))
    const { text } = search

    useEffect(() => {
        loadAllProducts()
    }, [])
    useEffect(() => {
        getCategories().then((res) => {setcategories(res.data)})
    }, [])
    useEffect(() => {
        getSubs().then((res) => {setsubs(res.data)})
    }, [])

    // loads product by default
    const loadAllProducts = () => {
        setloading(true)
        getProductsByCount(12).then((p) => {
            setproducts(p.data)
            setloading(false)
        })
    }

    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({query: text})
        }, 300)
        return () => clearTimeout(delayed)
    }, [text])

    useEffect(() => {
        fetchProducts({ price });
    }, [ok])
    

    const fetchProducts = (arg) => {
        fetchProductByFilter(arg).then((res) => {
            setproducts(res.data)
        })
    }

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        // console.log(value)
        setprice(value);
        setTimeout(() => {
            setok(!ok)
        }, 300);
        console.log("value", price)
    }
    
    const showCategories = () => 
        categories.map((c) =>
            <div key={c._id}>
                <Checkbox onChange={handleCheck} className='pb-2 pl-4 pr-4' value={c._id} name='category' checked={categoryIds.includes(c._id)}>
                    {c.name}
                </Checkbox>
                <br/>
            </div>
    )
    const showSubs = () => 
        subs.map((s) =>
            <div key={s._id} className='p-2 m-1 badge badge-secondary' style={{cursor: 'pointer'}} onClick={()=> handleSub(s)}>
                {s.name}
            </div>
    )
    const showBrands = () => 
        brands.map((b) =>
            <>
                <Radio className='p-2 m-1' value={b} name={b} style={{cursor: 'pointer'}} onChange={handleBrand} checked={b === brand}>
                    {b}
                </Radio>
                <br/>
            </>
    )
    const showColor = () => 
        colors.map((c) =>
            <>
                <Radio onChange={handleColor} className='pb-2 pl-4 pr-4' name={c} style={{cursor: 'pointer'}} value={c} checked={color === c}>{c}</Radio>
                <br/>
            </>
    )
    const showShipping = () => 
        <div>
            <Radio className='pb-2 pt-2 ml-4 pr-4' onChange={handleShipping} name="Yes" style={{cursor: 'pointer'}} value='Yes' checked={shipping === 'Yes'}>Yes</Radio>
            <br/>
            <Radio className='pb-2 pl-4 pr-4' name='No' onClick={handleShipping} style={{cursor: 'pointer'}} value='No' checked={shipping === 'No'}>No</Radio>
        </div>

    const handleStarClick = (num) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setprice([0,0])
        setcategoryIds([])
        fetchProducts({stars: num})
    }

    const showStars = () => 
        <div className='pr-4 pl-4 pb-2'>
            <Star
                starClick={handleStarClick}
                count={5}
            />
            <Star
                starClick={handleStarClick}
                count={4}
            />
            <Star
                starClick={handleStarClick}
                count={3}
            />
            <Star
                starClick={handleStarClick}
                count={2}
            />
            <Star
                starClick={handleStarClick}
                count={1}
            />
        </div>

    const handleCheck = (e) => {
        // reset other filter parameters
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setprice([0,0])
        setcolor('')
        setshipping('')
        setbrand('')
        setsub('')
        let inTheState = [...categoryIds]
        let justChecked = e.target.value
        let foundInTheState = inTheState.indexOf(justChecked)


        // to check if checked category is in the state list returns index if found and -1 if not.
        if (foundInTheState === -1) {
            inTheState.push(justChecked)
        } else{
            inTheState.splice(foundInTheState, 1)
        }
        setcategoryIds(inTheState)
        // console.log(" Category id's in the state are -->", inTheState)
        fetchProducts({category: inTheState})
    }

    const handleSub = (sub) => {
        // reset other filter parameters
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setprice([0,0])
        setcategoryIds([])
        setcolor('')
        setshipping('')
        setbrand('')
        setsub(sub)
        fetchProducts({sub})
    }
    
    const handleBrand = (e) => {
        setbrand(e.target.value)
        //
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setprice([0,0])
        setcategoryIds([])
        setsub('')
        setcolor('')
        setshipping('')
        fetchProducts({brand: e.target.value })
    }

    const handleColor = (e) => {
        setcolor(e.target.value)
        //
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setprice([0,0])
        setcategoryIds([])
        setsub('')
        setbrand('')
        setshipping('')
        fetchProducts({color: e.target.value})
    }
    
    const handleShipping = (e) => {
        setshipping(e.target.value)
        //
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setprice([0,0])
        setcategoryIds([])
        setsub('')
        setcolor('')
        setbrand('')
        fetchProducts({shipping: e.target.value})
    }
    
  return (
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-3'>
                <h4>Search/Filter</h4>
                <Menu defaultOpenKeys={["1","2"]} mode='inline'>
                    <SubMenu key="1" title={<span className='h6'><DollarOutlined/>Price</span>}>
                        <div>
                            <Slider className='ml-4 mr-4' range tipFormatter={(v) => `₦${v}`} value={price} onChange={handleSlider} max={1000000}/>
                        </div>
                    </SubMenu>
                    <SubMenu key="2" title={<span className='h6'><DownSquareOutlined />Categories</span>}>
                        {showCategories()}
                    </SubMenu>
                    <SubMenu key="3" title={<span className='h6'><StarOutlined/>Rating</span>}>
                        {showStars()}
                    </SubMenu>
                    <SubMenu key="4" title={<span className='h6'><DownSquareOutlined/>Sub Categories</span>}>
                        <div className='ml-2 mr-2'>
                            {showSubs()}
                        </div>
                    </SubMenu>
                    <SubMenu key="5" title={<span className='h6'><CarOutlined/>Shipping</span>}>
                        <div className='ml-2 mr-2'>
                            {showShipping()}
                        </div>
                    </SubMenu>
                    <SubMenu key="6" title={<span className='h6'><FormatPainterOutlined/>Color</span>}>
                        <div className='ml-2 mr-2'>
                            {showColor()}
                        </div>
                    </SubMenu>
                    <SubMenu key="7" title={<span className='h6'><DownSquareOutlined/>Brand</span>}>
                        <div className='ml-2 mr-2'>
                            {showBrands()}
                        </div>
                    </SubMenu>
                </Menu>
            </div>
            <div className='col-md-9'>
                {loading ? (
                    <h4 className='text-danger'>Loading</h4>
                ):(
                    <h4 className='text-primary mt-2'>Products</h4>
                )}
                {
                    loading ? <p>Loading products</p> : products.length < 1 && <p>No products found</p>
                }
                <div className='row'>
                    {products.map((p) => (
                        <div key={p._id} className='col-md-4'>
                            <ProductCard product={p}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Shop