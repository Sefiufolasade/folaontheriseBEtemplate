import React, { useState, useEffect } from 'react'
import { auth } from './Firebase';
import { toast } from 'react-toastify';
import {MailOutlined, GoogleOutlined, LoadingOutlined } from '@ant-design/icons';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';
import { useSelector } from 'react-redux';
import { createOrUpdateUser} from '../../functions/auth';


const Login = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false)

  let dispatch = useDispatch()
  let navigate = useNavigate()
  const { user }  = useSelector((state) => ({...state}))
  
  useEffect(() => {
    let intended = navigate.state
    if (intended) {
      return
    }
    else{
      if (user && user.token) {
      navigate('/')
    }
    }
    
  }, [user, navigate])

  const roleBasedRedirect = (res) => {
    let intended = navigate.state
    if (intended) {
      navigate(intended.from)
    }
    else{
      if (res.data.role === "admin") {
        // console.log('admin');
        navigate('/admin/dashboard')
      } else{
        // console.log('subscriber');
        navigate('/user/history')
      }
    }
  } 

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    //console.table(email, password)
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const idTokenResult = user.accessToken
      // console.log(userCredential);

      createOrUpdateUser(idTokenResult)
      .then((res) => {
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            name: res.data.name,
            email: res.data.email,
            token: idTokenResult,
            role: res.data.role,
            _id: res.data._id,
          }
        });
        roleBasedRedirect(res)
      })
      .catch((error) => {
        console.log("Caught ", error)
        toast.error(error)
        setLoading(false)
      })
    })
    .catch ((error) => {
      const errorMessage = error.message
      toast.error(errorMessage)
      setLoading(false)
    })
  }

  const googleLogin = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idTokenResult = credential.accessToken;
      // The signed-in user info.
      // const user = result.user;
      
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      createOrUpdateUser(idTokenResult)
      .then((res) => {
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            name: res.data.name,
            email: res.data.email,
            token: idTokenResult,
            role: res.data.role,
            _id: res.data._id,
          }
        });
        roleBasedRedirect(res)
      })
      // navigate('/')
    })
    .catch((error) => {
      const errorMessage = error.message
      toast.error(errorMessage)
    })
    // console.log('here and there');
  }

  // The user fills the login form
  const loginForm = () =>
  <form>
      <p>Welcome!, Log In To Your Account</p>
      <div className='form'>
          <input type='email' name='email' className='form-control' value={email} placeholder='Enter your Email' onChange={e => setemail(e.target.value)}/>
      </div>
      <div className='form'>
          <input type='password' name='password' className='form-control' placeholder='Enter your password' value={password} onChange={e => setpassword(e.target.value)}/>
      </div>
      
      {/* Different login options for the user */}
      <Space 
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        {loading ? <Button type='primary' size='large' shape='round' disabled block>
          <LoadingOutlined className='googleLogo'/>Loading
        </Button>:<Button onClick={handleSubmit} type='primary' size='large' shape='round' disabled={!email || password.length < 6} block>
          <MailOutlined className='googleLogo'/>Login with Email and Password
        </Button>}
        
        <Button onClick={googleLogin} type='primary' danger size='large' shape='round' block>
          <GoogleOutlined className='googleLogo'/>Login with Google
        </Button>
      </Space>
  </form>
  return (
    // The form being rendered on the login page
    <div className='container p-5'>
        <div className='row'>
            <div className='col-md-6 offset-md-3'>
              {loading ? (<h4 className='text-danger'>Loading...</h4>):(<h4>Login</h4>)}
              {loginForm()}
              <Link to={'/forgot/password'} className='float-right'>Forgot Password?</Link>
            </div>   
        </div>
    </div>
  )
}

export default Login