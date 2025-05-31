import React from 'react'
import { Card, Skeleton } from 'antd'
import SkeletonInput from 'antd/es/skeleton/Input'

const ProductCard = ({count}) => {
    const card = () => {
        let totalCards = []
        for (let index = 0; index < count; index++) {
            totalCards.push(
                <Card style={{width: 200, padding: 0, marginRight: 10}}>
                    <SkeletonInput style={{height: 150,marginBottom: 5, marginRight: 10}} active />
                    <Skeleton active></Skeleton>
                </Card>
            )
        }
        return totalCards;
    }
  return (
        <div className='row pb-5'>{card()}</div>
    )
  
}

export default ProductCard