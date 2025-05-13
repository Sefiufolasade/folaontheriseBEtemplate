import React from 'react'
import { useSelector } from 'react-redux'
import {Outlet} from 'react-router-dom'
import LoadingToRedirect from './LoadingToRedirect'

const UserRoute = () => {
  const { user }  = useSelector((state) => ({...state}))
  return user && user.token ? (
    <Outlet />
  ) : (
    <LoadingToRedirect />
  );
}

export default UserRoute