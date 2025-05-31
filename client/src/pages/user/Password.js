import {React, useState} from 'react'
import UserNav from '../../components/nav/UserNav'
import { auth } from '../auth/Firebase'
import { updatePassword } from 'firebase/auth'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import AdminNav from '../../components/nav/AdminNav'

const Password = () => {
    const {user} = useSelector((state) => ({...state}))
    const [password, setpassword] = useState('')
    const [loading, setloading] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault();
        setloading(true);

        updatePassword(auth.currentUser, password)
        .then(() => {
            // on successful password change
            setloading(false)
            toast.success('Password Updated Successfully')
            setpassword('')
        })
        .catch((err) => {
            // Case of error caught
            setloading(false)
            toast.error(err)
        })
    }
    const PasswordUpdateForm = () => <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <label> Your Password</label>
            <input type='password' value={password}  onChange={e => setpassword(e.target.value)} className='form-control' placeholder='Enter new Password' disabled={loading}/>
            <br></br>
            <button className='btn btn-primary' disabled={password.length<8 || loading}>Submit</button>
        </div>
    </form>
    return(
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    {user &&user.role ==="admin"?<AdminNav/>:<UserNav/>}
                </div>
                <div className='col'>
                    {loading ? <h4 className='text-danger'>Loading...</h4>:<h4>Password Update</h4>}
                    {PasswordUpdateForm()}
                </div>
            </div>
        </div>

    )
}

export default Password