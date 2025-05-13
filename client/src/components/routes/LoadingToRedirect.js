import { React, useState, useEffect }from 'react'
import { useNavigate } from 'react-router-dom'

const LoadingToRedirect = () => {
    const [count, setcount] = useState(5)
    let  navigate = useNavigate()
    useEffect(() => {
        const interval = setInterval(() => {
            setcount((currentCount) => --currentCount)
        }, 1000)
        
        // redirecting when count = 0 
        count === 0 && navigate('/login')
        // cleanup
        return() => clearInterval(interval)

    }, [count,navigate])

    return (
        <div className='container p-5 text-center'>
            <p>Redirecting in {count} seconds</p>
        </div>
    )
}

export default LoadingToRedirect