import axios from 'axios';

export const getCategories = async () => 
    await axios.get("http://localhost:8000/api/categories"); 

export const getCategory = async (slug) => 
   await axios.get(`http://localhost:8000/api/category/${slug}`);

export const removeCategory = async (slug, authtoken) => 
   await axios.delete(`http://localhost:8000/api/category/${slug}`, {
        headers: {
            authtoken
        }
    });

export const updateCategory = async (slug, category, authtoken) => 
   await axios.put(`http://localhost:8000/api/category/${slug}`, category,
    {
        headers: {
            authtoken
        }
    });

export const createCategory = async (category, authtoken) => 
   await axios.post(`http://localhost:8000/api/category`, category, 
    {
        headers: {
            authtoken
        }
    });

export const getCategorySubs = async(_id) =>
    await axios.get(`http://localhost:8000/api/category/subs/${_id}`);
