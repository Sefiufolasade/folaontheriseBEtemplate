import React from 'react'
import {Rating} from 'react-simple-star-rating'

const Star = ({starClick, count}) => {
  return (
    <div>
        <Rating
            onClick={(rate) => starClick(rate)}
            rate = {count}
            iconsCount={count}
            size= "30"
            fillColor='gold'
            emptyColor='gold'
        />
    </div>
  )
}

export default Star