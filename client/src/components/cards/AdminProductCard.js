import { React }from 'react'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { Card } from 'antd'


const { Meta } = Card;
const AdminProductCard = ({product, handleRemove}) => {
    const { title, description, images, slug } = product

  return (
    <Card
    hoverable
    style={{
      width: 240,
      marginBottom: 10,
    }}
    className='p-1'
    cover={<img alt={product.title || "product image"} style={{width: 232,height: 150, objectFit: "cover"}}src={images && images.length ? images[0].url:"https://res.cloudinary.com/dvdy3c2af/image/upload/v1689964304/cld-sample-2.jpg"} />}
    actions={[
        <Link to={`/admin/product/${slug}`}>
            <EditOutlined className='text-primary'/>
        </Link>,
        <DeleteOutlined className='text-danger' onClick={() => handleRemove(slug)}/>,
    ]}
  >
    <Meta title={title} description={`${description && description.substring(0,50)}...`} />
  </Card>
  )
}

export default AdminProductCard