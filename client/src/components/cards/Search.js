import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'

const Search = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { search } = useSelector((state) => ({ ...state}))
    const { text } = search
    
    const handleChange = (e) => {
        // console.log(e.target.value);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: e.target.value },
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/shop?${text}`)
    }
  return (
    <div className='row mt-2'>
            <form className='form-inline my-lg-0' style={{display: "flex"}} onSubmit={handleSubmit}>
                <input
                    onChange={handleChange}
                    type='search'
                    value={text}
                    className='form-control pb-2 mr-sm-2'
                    placeholder='Search'
                />
                <SearchOutlined onClick={handleSubmit} style={{cursor: "pointer", marginTop: "12px"}} />
            </form>
    </div>
  )
}

export default Search