import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux';
import Jumbotron from '../components/cards/Jumbotron';
import chair from'../image/chairNone.jpg';
import NewProducts from '../components/home/NewProducts';
import BestSellers from '../components/home/BestSellers';
import CategoryList from '../components/cards/category/CategoryList';
import SubList from '../components/cards/sub/SubList';

const Home = () => {
  // let { user } = useSelector((state) => ({...state}))
  const textList = ['Innterior...','Innterior with style','New Products', 'Popular Designs', 'Popular Products']
  const [loading, setloading] = useState(false)


  return (
    <div>
      <div className="jumbotron">
        <div className='container text-center'>
          {loading ?<h4 className='text-danger'>Loading...<img className='imgrotate' alt='' src={chair} /></h4>:<h2><Jumbotron text={textList}/></h2>}
        </div>
      </div>
            
      <div>
        <NewProducts />
        <BestSellers />
        <div className='container pb-3'>
          <CategoryList/>
        </div>
        <div className='container pb-3'>
          <SubList/>
        </div>
        
      </div>
      
    </div>
  )
}

export default Home