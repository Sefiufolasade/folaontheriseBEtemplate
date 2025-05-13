import axios from 'axios';

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post("http://localhost:8000/api/create-or-update-user", 
  {},
  {
    headers: {
      authtoken
    },
  })
}

export const currentUser = async (authtoken) => {
  return await axios.post("http://localhost:8000/api/current-user", 
  {},
  {
    headers: {
      authtoken,
    },
  })
}
export const currentAdmin = async (authtoken) => {
  return await axios.post("http://localhost:8000/api/current-admin", 
  {},
  {
    headers: {
      authtoken,
    },
  })
}