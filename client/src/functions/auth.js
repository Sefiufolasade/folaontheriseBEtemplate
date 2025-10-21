import axios from 'axios';

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(`${process.env.APP_SERVER}/create-or-update-user`, 
  {},
  {
    headers: {
      authtoken
    },
  })
}

export const currentUser = async (authtoken) => {
  return await axios.post(`${process.env.APP_SERVER}/current-user`, 
  {},
  {
    headers: {
      authtoken,
    },
  })
}
export const currentAdmin = async (authtoken) => {
  return await axios.post(`${process.env.APP_SERVER}/current-admin`, 
  {},
  {
    headers: {
      authtoken,
    },
  })
}