import axios from 'axios';

export const getCoupons = async () => 
    await axios.get(`https://innteriors-backend.onrender.com/api/coupons`); 

export const getCoupon = async (slug) => 
   await axios.get(`https://innteriors-backend.onrender.com/api/coupon/${slug}`);

export const removeCoupon = async (slug, authtoken) => 
   await axios.delete(`https://innteriors-backend.onrender.com/api/coupon/${slug}`, {
        headers: {
            authtoken
        }
    });

export const updateCoupon = async (slug, coupon, authtoken) => 
   await axios.put(`https://innteriors-backend.onrender.com/api/coupon/${slug}`, coupon,
    {
        headers: {
            authtoken
        }
    });

export const createCoupon = async (coupon, authtoken) => 
   await axios.post(`https://innteriors-backend.onrender.com/api/coupon`, coupon, 
    {
        headers: {
            authtoken
        }
    });
