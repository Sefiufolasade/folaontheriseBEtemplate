import React, {useState} from 'react'
import { Modal } from 'antd'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import {StarOutlined} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const RatingModal = ({children}) => {
    const {user} = useSelector((state) => ({...state}))
    const [modalVisible, setmodalVisible] = useState(false)
    const navigate = useNavigate()
    const { slug } = useParams()

    const handleModal = () => {
        if (user && user.token) {
            setmodalVisible(true)
        }else{
            navigate({
                pathname: '/login',
                state: {from :`/product/${slug}`},
            })   
        }
        
    }
    return (
        <>
            <div onClick={() => handleModal()}>
                <StarOutlined className='text-danger'/><br/>{" "}
                {user ? "Leave rating":"Login to leave rating"}
            </div>
            <Modal
                title="Leave Your Rating!"
                centered
                open={modalVisible}
                onOk={() => {
                    setmodalVisible(false)
                    toast.success("Thanks for your review. It will appear soon")
                }}
                onCancel={() => setmodalVisible(false)}
            >{children}</Modal>
        </>
    );
}

export default RatingModal