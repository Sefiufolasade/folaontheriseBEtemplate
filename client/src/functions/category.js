import axios from 'axios';

export const getCategories = async () => 
    await axios.get(`https://innteriors-backend.onrender.com/api/categories`); 

export const getCategory = async (slug) => 
   await axios.get(`https://innteriors-backend.onrender.com/api/category/${slug}`);

export const removeCategory = async (slug, authtoken) => 
   await axios.delete(`https://innteriors-backend.onrender.com/api/category/${slug}`, {
        headers: {
            authtoken
        }
    });

export const updateCategory = async (slug, category, authtoken) => 
   await axios.put(`https://innteriors-backend.onrender.com/api/category/${slug}`, category,
    {
        headers: {
            authtoken
        }
    });

export const createCategory = async (category, authtoken) => 
   await axios.post(`https://innteriors-backend.onrender.com/api/category`, category, 
    {
        headers: {
            authtoken
        }
    });

export const getCategorySubs = async(_id) =>
    await axios.get(`https://innteriors-backend.onrender.com/api/category/subs/${_id}`);
