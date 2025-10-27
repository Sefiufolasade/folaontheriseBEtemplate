import axios from 'axios';

export const getSubs = async () => 
    await axios.get(`https://innteriors-backend.onrender.com/api/subs`); 

export const getSub = async (slug) => 
   await axios.get(`https://innteriors-backend.onrender.com/api/sub/${slug}`);

export const removeSub = async (slug, authtoken) => 
   await axios.delete(`https://innteriors-backend.onrender.com/api/sub/${slug}`, {
        headers: {
            authtoken
        }
    });

export const updateSub = async (slug, sub, authtoken) => 
   await axios.put(`https://innteriors-backend.onrender.com/api/sub/${slug}`, sub,
    {
        headers: {
            authtoken
        }
    });

export const createSub = async (sub, authtoken) => 
   await axios.post(`https://innteriors-backend.onrender.com/api/sub`, sub, 
    {
        headers: {
            authtoken
        }
    });



