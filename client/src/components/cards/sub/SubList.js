import React, { useEffect, useState } from 'react'
import { getSubs} from '../../../functions/sub'
import { Link } from 'react-router-dom'

const SubList = () => {
    const [subs, setsubs] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        setloading(true)
      getSubs().then((c) => {
        setsubs(c.data)
        setloading(false)
      })
    }, [])
    
    const showSubs = () => subs.length > 0 && subs.map((s) => <div className='col btn text-primary btn-outlined-primary btn-raised btn-lg btn-block m-2'><Link to={`/sub/${s.slug}`}>{s.name}</Link></div>)
  return (
    <div className='container'>
        <div className='row'>
            <div className='text-center pt-5'>
                <h5>Sub Categories</h5>
            </div>
            {loading ? (<h4 className='text-center'> Loading...</h4>): showSubs()}
        </div>
    </div>
  )
}

export default SubList