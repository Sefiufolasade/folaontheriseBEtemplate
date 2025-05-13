import { AppstoreOutlined, ShoppingOutlined, ShoppingCartOutlined, UserSwitchOutlined, LogoutOutlined, ProfileOutlined, UserAddOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut} from 'firebase/auth';
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import Search from '../cards/Search';

const Header = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('/');

    let dispatch = useDispatch();
    let { user, cart } = useSelector((state) => ({ ...state }))   

    const items = [
      {
        label: 'Home',
        key: '/',
        icon: <AppstoreOutlined />,
      },
      {
        label: 'Shop',
        key: '/shop',
        icon: <ShoppingOutlined />,
      },
      {
        label:` Cart - ${cart.length}`,
        badge:  [
          {
            label: `${cart.length}`,
          }
        ],
        key: '/cart',
        icon: <ShoppingCartOutlined />,
      },
      
      user && {
        label: user.name,
        key: 'user',
        icon: <UserOutlined/>,
        className: "menuGroup",
        children: [
          {
            type: 'group',
            children: [              
              user.role === 'subscriber' && ({ 
                label: 'Profile',
                key: '/user/history',
                icon : <ProfileOutlined/>,
              }),
              user.role === 'admin' && ({ 
                label: 'Admin Dashboard',
                key: '/admin/dashboard',
                icon : <ProfileOutlined/>,
              }),
              {
                label: 'Log Out',
                key: 'logout',
                icon : <LogoutOutlined/>,
              },
            ],
          },
        ],
      },
      !user && {
        label: 'Sign In',
        key: 'signIn',
        icon: <UserSwitchOutlined/>,
        className: "menuGroup",
        children: [
          {
            type: 'group',
            children: [
              {
                label: 'Log In',
                key: '/login',
                icon : <UserOutlined/>,
              },
              {
                label: `Sign up`,
                key: '/register',
                icon: <UserAddOutlined/>,
              },
            ],
          },
        ],
      },
      {
        label: 'Help',
        key: '/help',
        icon: <SettingOutlined/>,
        className: 'float-right'
      },
      {
        label: <Search/>,
        key: 'search'
      },
    ];
    
    const logout = (e) => {
      const auth = getAuth();
      signOut(auth)
      .then(() => {
        dispatch({
          type: "LOGOUT",
          payload: null,
        });
        setCurrent('/')
        navigate('/')
      })
      .catch((error) => {
        // An error happened.
        const errorMessage = error.message
        toast.error(errorMessage)
      });
    };

    const onClick = (e) => {
      if (e.key === 'logout') {
        logout()
      }else if (e.key === "search"){
        console.log(e.key);
      }
      else{
        setCurrent(e.key);
        navigate(e.key);
      }
        
    };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" user={user} items={items}/>
};
export default Header;
